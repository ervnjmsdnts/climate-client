import { supabaseClient } from '../lib/supabase';
import { useQuery, useQueryClient } from 'react-query';
import {
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  parseISO,
  startOfWeek,
} from 'date-fns';
import { useEffect } from 'react';
import { Thermometer } from 'lucide-react';
import { Droplet } from 'lucide-react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  YAxis,
} from 'recharts';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import { CSVLink } from 'react-csv';
import { cn } from '../lib/utils';

function CustomTooltip({ active, payload, type }) {
  if (active && payload && payload.length) {
    console.log(payload[0].payload);
    return (
      <div
        className={`p-2 rounded-lg font-semibold text-white ${
          type === 'temp' ? 'bg-red-300' : 'bg-blue-300'
        }`}>
        <p>
          {type === 'temp'
            ? `${payload[0].value}\xB0C`
            : `${payload[0].value}%`}
        </p>
        <p>{format(new Date(payload[0].payload.created_at), 'PPp')}</p>
      </div>
    );
  }

  return null;
}

export default function Dashboard() {
  const { data: climates, isLoading } = useQuery({
    queryKey: 'climates',
    queryFn: async () => {
      const { data } = await supabaseClient
        .from('climate')
        .select()
        .order('created_at', { ascending: true });
      return data;
    },
  });

  const [selectedFilter, setSelectedFilter] = useState('All Time');

  const filteredData = useMemo(() => {
    let filteredData = climates;

    if (selectedFilter === 'Current Day') {
      const currentDate = new Date();
      filteredData = filteredData.filter((climate) =>
        isSameDay(parseISO(climate.created_at), currentDate),
      );
    } else if (selectedFilter === 'Current Month') {
      const currentDate = new Date();
      filteredData = filteredData.filter((climate) =>
        isSameMonth(parseISO(climate.created_at), currentDate),
      );
    } else if (selectedFilter === 'Current Week') {
      const currentDate = new Date();
      const weekStart = startOfWeek(currentDate);
      const weekEnd = endOfWeek(currentDate);

      filteredData = filteredData.filter((climate) =>
        isWithinInterval(parseISO(climate.created_at), {
          start: weekStart,
          end: weekEnd,
        }),
      );
    }

    filteredData?.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );

    return filteredData;
  }, [climates, selectedFilter]);

  const sortedDataForTable = filteredData
    ?.slice()
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

  const csvData = sortedDataForTable?.map((data) => ({
    Temperature: data.temperature,
    Humidity: data.humidity,
    Date: format(new Date(data.created_at), 'PPP').toString(),
  }));

  const latestClimate = sortedDataForTable?.[0];

  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabaseClient
      .channel('realtime_audits')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'climate',
        },
        () => {
          queryClient.invalidateQueries('climates');
        },
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [queryClient]);

  return (
    <div className='p-2 sm:p-8 flex-grow'>
      {climates && climates.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-6 sm:grid-rows-4 w-full gap-4 h-full'>
          <div className='col-span-2 flex sm:gap-4 gap-2 flex-col sm:flex-row w-full'>
            <div
              className={cn(
                'card w-full text-white hover:shadow-xl shadow-lg',
                latestClimate?.temperature < 15
                  ? 'bg-blue-300'
                  : latestClimate?.temperature > 26
                  ? 'bg-red-300'
                  : 'bg-green-300',
              )}>
              <div className='card-body'>
                <div className='flex justify-between items-center'>
                  <h2 className='card-title'>Temperature</h2>
                  <Thermometer />
                </div>
                <div className='flex items-center justify-center h-full'>
                  <h2 className='text-4xl text-center font-semibold'>
                    {latestClimate?.temperature}&deg;C
                  </h2>
                </div>
              </div>
            </div>
            <div className='card bg-blue-300 w-full text-white hover:shadow-xl shadow-lg'>
              <div className='card-body'>
                <div className='flex justify-between items-center'>
                  <h2 className='card-title'>Humidity</h2>
                  <Droplet />
                </div>
                <div className='flex items-center justify-center h-full'>
                  <h2 className='text-4xl text-center font-semibold'>
                    {latestClimate.humidity}%
                  </h2>
                </div>
              </div>
            </div>
          </div>
          <div className='sm:col-span-4 col-span-2 sm:row-span-4 sm:w-full gap-4 flex flex-col'>
            <div className='sm:self-end'>
              <select
                onChange={(e) => setSelectedFilter(e.target.value)}
                className='select select-bordered rounded-lg w-full sm:max-w-xs'>
                <option value='All Time'>All Time</option>
                <option value='Current Day'>Current Day</option>
                <option value='Current Week'>Current Week</option>
                <option value='Current Month'>Current Month</option>
              </select>
            </div>
            <div className='card h-full shadow-lg hover:shadow-xl sm:p-4'>
              <div className='card-body min-h-[300px] sm:min-h-full'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={filteredData}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <YAxis />
                    <Legend />
                    <Tooltip content={<CustomTooltip type='temp' />} />
                    <Line
                      type='monotone'
                      dataKey='temperature'
                      stroke='#fca5a5'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className='card h-full shadow-lg hover:shadow-xl p-4'>
              <div className='card-body min-h-[300px] sm:min-h-full'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={filteredData}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <Tooltip content={<CustomTooltip type='hum' />} />
                    <YAxis />
                    <Legend />
                    <Line type='monotone' dataKey='humidity' stroke='#93c5fd' />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className='card shadow-lg col-span-2 flex flex-col min-h-[300px] row-span-2 sm:row-span-3'>
            <CSVLink
              className='btn btn-primary sm:self-end mb-2 btn-sm'
              data={csvData}
              filename={`${format(new Date(), 'MM-dd-yyyy')}_climate.csv`}>
              Download CSV
            </CSVLink>
            <div className='flex-grow card-body h-0 overflow-y-auto'>
              <table className='table'>
                <thead>
                  <tr>
                    <th>Temperature</th>
                    <th>Humidity</th>
                    <th>Date-time</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedDataForTable?.map((climate) => (
                    <tr key={climate.id}>
                      <td className='text-red-400 font-medium'>
                        {climate.temperature}&deg;C
                      </td>
                      <td className='text-blue-400 font-medium'>
                        {climate.humidity}%
                      </td>
                      <td>
                        {format(
                          new Date(climate.created_at),
                          'MMM dd, yyyy hh:mm a',
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : isLoading ? (
        <div className='flex items-center justify-center w-full h-full'>
          <Loader2 className='h-8 w-8 animate-spin' />
        </div>
      ) : null}
    </div>
  );
}

import { supabaseClient } from '../lib/supabase';
import { useQuery, useQueryClient } from 'react-query';
import { format } from 'date-fns';
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

function CustomTooltip({ active, payload, type }) {
  if (active && payload && payload.length) {
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
      </div>
    );
  }

  return null;
}

export default function Dashboard() {
  const { data: climates } = useQuery({
    queryKey: 'climates',
    queryFn: async () => {
      const { data } = await supabaseClient
        .from('climate')
        .select()
        .order('created_at', { ascending: false });
      return data;
    },
  });

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
    <div className='p-8 flex-grow'>
      <div className='grid grid-cols-6 grid-rows-4 gap-4 h-full'>
        <div className='col-span-2 flex gap-4'>
          <div className='card bg-red-300 w-full text-white hover:shadow-xl shadow-lg'>
            <div className='card-body'>
              <div className='flex justify-between items-center'>
                <h2 className='card-title'>Temperature</h2>
                <Thermometer />
              </div>
              <div className='flex items-center justify-center h-full'>
                <h2 className='text-4xl text-center font-semibold'>20&deg;C</h2>
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
                <h2 className='text-4xl text-center font-semibold'>30%</h2>
              </div>
            </div>
          </div>
        </div>
        <div className='col-span-4 row-span-4 gap-4 flex flex-col'>
          <div className='card h-full shadow-lg hover:shadow-xl p-4'>
            <div className='card-body'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart data={climates}>
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
            <div className='card-body'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart data={climates}>
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
        <div className='card shadow-lg col-span-2 flex flex-col row-span-3'>
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
                {climates?.map((climate) => (
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
    </div>
  );
}

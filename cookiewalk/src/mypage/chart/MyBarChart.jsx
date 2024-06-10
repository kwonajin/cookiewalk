import React, { useEffect, useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { supabase } from '../../supabaseClient';
import moment from 'moment';

const MyBarChart = ({ user, type }) => {
  const [chartData, setChartData] = useState([]);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('walking_record')
        .select('distance, end_time')
        .eq('user_id', user);

      if (error) {
        console.error('Error fetching walking_record:', error);
        return;
      }

      const today = moment();
      setCurrentDate(today.format('YYYY-MM-DD')); // 현재 년, 월, 일 설정

      if (type === 'week') {
        // 주별 데이터 처리
        const weekData = Array(7).fill(0).map((_, i) => ({
          date: today.clone().subtract(i, 'days').format('MM-DD'),
          distance: 0,
        })).reverse();

        data.forEach(record => {
          const recordDate = moment(record.end_time);
          const diffDays = today.diff(recordDate, 'days');
          if (diffDays < 7) {
            weekData[6 - diffDays].distance += record.distance;
          }
        });

        setChartData(weekData);
      } else if (type === 'month') {
        // 월별 데이터 처리
        const monthData = Array(4).fill(0).map((_, i) => ({
          week: `${i + 1}주`,
          distance: 0,
        }));

        data.forEach(record => {
          const recordDate = moment(record.end_time);
          if (recordDate.month() === today.month() && recordDate.year() === today.year()) {
            const weekOfMonth = Math.floor(recordDate.date() / 7);
            monthData[weekOfMonth].distance += record.distance;
          }
        });

        setChartData(monthData);
      } else if (type === 'year') {
        // 년별 데이터 처리
        const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
        const yearData = monthNames.map((month, i) => ({
          month: month,
          distance: 0,
        }));

        data.forEach(record => {
          const recordDate = moment(record.end_time);
          if (recordDate.year() === today.year()) {
            yearData[recordDate.month()].distance += record.distance;
          }
        });

        setChartData(yearData);
      }
    };

    fetchData();
  }, [user, type]);

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <h3 style={{ margin: "0px" }}>{`현재 날짜: ${currentDate}`}</h3>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          width={500}
          height={300}
          data={chartData}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            style={{ fontSize: "12px" }} 
            dataKey={type === 'week' ? 'date' : type === 'month' ? 'week' : 'month'}
            interval={0} // 모든 레이블을 표시
            angle={-45} // 레이블을 기울여서 표시
            textAnchor="end" // 레이블의 끝을 축에 맞춤
          />
          <YAxis 
            style={{ fontSize: "12px" }} 
            tickFormatter={(value) => `${value} km`} 
          />
          <Tooltip 
            formatter={(value) => `${value} km`} 
            labelFormatter={(label) => `${label}`} 
          />
          <Legend 
            formatter={() => '거리'} 
          />
          <Bar dataKey="distance" name="거리" fill="#0479F1" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MyBarChart;

// <ResponsiveContainer> 차트 크기 부모 크기에 맞게 자동 조절
// BarChart 그래프 관련 설정 : (width 그래프 너비, heigh 그리프 높이, data 사용할 데이터, margin 차트 내부 여백)
// CartesianGrid 격자선 스타일설정
// XAxis X축에 표시할 데이터 설정
// Tooltip 차트에 마우스 올렸을 때 나타나는 툴팁
// Legend 타
import React from 'react';
import { Bar,BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { name: '1월', uv: 4000 },
  { name: '2월', uv: 3000 },
  { name: '3월', uv: 2000 },
  { name: '4월', uv: 2780 },
  { name: '5월', uv: 1890 },
  { name: '6월', uv: 2390 },
  { name: '7월', uv: 3490 },
  { name: '8월', uv: 3490 },
  { name: '9월', uv: 3490 },
  { name: '10월', uv: 3490 },
  { name: '11월', uv: 3490 },
  { name: '12월', uv: 3490 }
];

const MyBarChart = () => (
  <ResponsiveContainer width="100%" height={300}>
  <BarChart
    width={25}
    height={15}
    data={data}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="uv" fill="#82ca9d" />
  </BarChart>
</ResponsiveContainer>
);

export default MyBarChart;


// <ResponsiveContainer> 차트 크기 부모 크기에 맞게 자동 조절
// BarChart 그래프 관련 설정 : (width 그래프 너비, heigh 그리프 높이, data 사용할 데이터, margin 차트 내부 여백)
// CartesianGrid 격자선 스타일설정
// XAxis X축에 표시할 데이터 설정
// Tooltip 차트에 마우스 올렸을 때 나타나는 툴팁
// Legend 타
import React from "react";
import { PieChart,Pie,Cell } from "recharts";

const data = [
{ name:"Agriculture", value:40 },
{ name:"Health", value:25 },
{ name:"Housing", value:20 },
{ name:"Business", value:15 }
];

export default function Analytics(){

return(

<div className="p-10">

<h1 className="text-2xl font-bold mb-6">
Platform Analytics
</h1>

<PieChart width={400} height={300}>
<Pie
data={data}
dataKey="value"
cx="50%"
cy="50%"
outerRadius={100}
/>
</PieChart>

</div>

)

}
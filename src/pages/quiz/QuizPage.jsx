import React, {useState} from "react";
import { matchSchemes } from "../../utils/eligibilityEngine";

const QuizPage = () => {

const [age,setAge] = useState("");
const [income,setIncome] = useState("");
const [occupation,setOccupation] = useState("");

const [result,setResult] = useState([]);

const submitQuiz = () =>{

const matched = matchSchemes({
age:Number(age),
income:Number(income),
occupation
})

setResult(matched)

}

return (

<div className="p-10">

<h1 className="text-2xl font-bold mb-6">
Eligibility Quiz
</h1>

<input
placeholder="Age"
className="border p-2 mr-4"
onChange={e=>setAge(e.target.value)}
/>

<input
placeholder="Annual Income"
className="border p-2 mr-4"
onChange={e=>setIncome(e.target.value)}
/>

<select
className="border p-2"
onChange={e=>setOccupation(e.target.value)}
>
<option>Farmer</option>
<option>Self-employed</option>
<option>Student</option>
<option>Any</option>
</select>

<button
onClick={submitQuiz}
className="bg-blue-600 text-white px-6 py-2 ml-4"
>
Find Schemes
</button>

<div className="mt-8">

{result.map(s =>(

<div key={s.id} className="border p-4 mb-3">

<h2 className="font-semibold">
{s.name}
</h2>

<p>{s.benefit}</p>

</div>

))}

</div>

</div>

);

}

export default QuizPage;
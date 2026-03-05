import { schemes } from "../data/schemes";

export function matchSchemes(user){

return schemes.filter(scheme =>{

const ageMatch =
user.age >= scheme.minAge;

const incomeMatch =
user.income <= scheme.maxIncome;

const occupationMatch =
scheme.occupation.includes("Any") ||
scheme.occupation.includes(user.occupation);

return ageMatch && incomeMatch && occupationMatch;

})

}
export function aiRecommend(matchedSchemes){

return matchedSchemes.sort(
()=>Math.random() - 0.5
).slice(0,3)

}
//  定义等级权重，权重越高，等级越高
const levelWeightMap = {
  世界级: 5,
  国家级: 4,
  省级: 3,
  市级: 2,
  县级: 1,
};

//  比较两个等级的高低
export function compareHeritageLevel(levelA, levelB) {
  const weightA = levelWeightMap[levelA] || 0;
  const weightB = levelWeightMap[levelB] || 0;

  if (weightA > weightB) return 1;
  if (weightA < weightB) return -1;
  return 0;
}

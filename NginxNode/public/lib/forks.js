let numsRandoms = {};
process.on('message', cant => {
  console.log(cant);
  for(let i=0; i < cant; i++) {
    const numRandom = Math.floor(Math.random()*1000)+1;
    if(numsRandoms.hasOwnProperty(numRandom)) {
      numsRandoms[numRandom] = numsRandoms[numRandom] + 1;
    } else {
      numsRandoms[numRandom] = 1;
    }
  }
  process.send(numsRandoms);
})
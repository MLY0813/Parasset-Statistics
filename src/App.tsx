import React from 'react';
import { useFront18Data_ins, useFront18Data_mor } from './lib/useEtherData';

function App() {
  const front18MorData = useFront18Data_mor()
  const front18InsData = useFront18Data_ins()
  const front18MorData_user = front18MorData.allAddress.map((item, index) => (
    <li key={item}>地址：{item}<br/>积分：{front18MorData.morETHUserPoint[index].toString()}</li>
  ))
  return (
    <div className="App">
      <h1>18前抵押总分(ETH)：{front18MorData.morETHTotal.toString()}</h1>
      <ul>
        {front18MorData_user}
      </ul>
    </div>
  );
}

export default App;

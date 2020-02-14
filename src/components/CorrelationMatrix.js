import React, { useRef, useEffect } from 'react'
import styled from 'styled-components';
import Biden from '../assets/Biden.gif';
import Warren from '../assets/Warren.gif';
import Gabbard from '../assets/Gabbard.gif';
import Klobuchar from '../assets/Klobuchar.gif';
import BootEdgeEdge from '../assets/BootEdgeEdge.gif';
import * as d3 from 'd3'

const MatrixRow = styled.div`
  display:flex;
  justify-content:flex-start;
  height:60px;
`

const Cell = styled.div`
    display:flex;
    justify-content:center;
    align-items:center;
    height:60px;
    width:60px;
`;

const MatrixCell = styled(Cell)`
    border: 1px solid #666;
    box-sizing:border-box;
    background: ${(props,t,y) => props.bgcolor}};
    opacity: .8;
    font-size:24px;
`;

const Matrix = styled.div`
    display:flex;
    justify-content:flex-start;
    flex-direction:column;
`;

export default function CorrelationMatrix (props) {
    
    let candidates = {
        BootEdgeEdge,
        Klobuchar,
        Gabbard,
        Warren,
        Biden
    }

    let matrixData = [
        {name:'BootEdgeEdge', values:[0,0.5,0.6,0.7,0.9,0.7]},
        {name:'Klobuchar',    values:[0,0.4,0.5,0.4,0.8,0.6]},
        {name:'Gabbard',      values:[0,0.3,0.6,0.5,0.7,0.7]},
        {name:'Warren',       values:[0,0.1,0.2,0.3,0.5,0.8]},
        {name:'Biden',        values:[0,0.3,0.4,0.3,0.2,0.5]}
    ];

    let header = [ 
        'BootEdgeEdge',
        'Klobuchar',
        'Gabbard',
        'Warren',
        'Biden'
    ];

    return (
        <div style={{width:450}}>       
           <Matrix>
               <MatrixRow> <Cell />{header.map(cell => <img src={candidates[cell]} width="60px" height="60px" className="node" /> )}</MatrixRow>
              {matrixData.map(row => {
                 return (<MatrixRow>      
                  {row.values.map((cell,i) => {
                      console.log({cell,color:d3.interpolateRdBu(cell)})
                      return i == 0 ? (
                      <Cell  >
                         <img src={candidates[row.name]} width="60px" height="60px" className="node" />  
                      </Cell>) :
                      (<MatrixCell bgcolor={d3.interpolateRdBu(cell)}>{cell}</MatrixCell>);
                  })}
                 </MatrixRow> )    
             })}

           </Matrix> 
        </div>
    );
     
  }

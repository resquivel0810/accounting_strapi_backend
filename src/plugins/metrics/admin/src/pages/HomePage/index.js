/*
 *
 * HomePage
 *
 */

import React from 'react';
import{
  Layout,
  BaseHeaderLayout,
  ContentLayout,
  Box,
  GridLayout,
  Typography,

} from "@strapi/design-system/";
import { Table, Thead, Tbody, Tr, Td, Th } from '@strapi/design-system';
import { Link } from '@strapi/design-system/v2';
import * as d3 from "d3";
  import axios from 'axios'
  import {
    Element
  } from 'react-faux-dom';
import {useState} from 'react';
import {useEffect} from 'react';
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';

const HomePage = () => {
  const [averagetime, setAveragetime] = useState(null);
  const [topterms, setTopterms] = useState(null);
  const [topMissing, setTopMissing] = useState(null);
  const [last, setLast] = useState(null);
  var listTerms;
  var listMissing;
  var listChanges;
  useEffect(() => {
    Promise.all([
      fetch(`https://thawing-cliffs-23888-c80efe02f60e.herokuapp.com/v1/countusers/`).then(data => data.json()),
      fetch(`https://thawing-cliffs-23888-c80efe02f60e.herokuapp.com/v1/getactiveuser/`).then(data => data.json()),
      fetch(`https://thawing-cliffs-23888-c80efe02f60e.herokuapp.com/v1/countlostusers/`).then(data => data.json()),
    ])
    .then(data=> {
        console.log(data[0], data[1], data[0].total - data[1].total, data[2])
        const data1 = [data[0].total, data[1].total, data[0].total - data[1].total, data[2].total]
        const w = 1000;
        const h = 300;
          const svg = d3.select("#chart")
                      .append("svg")
                      .attr("width", w)
                      .attr("height",h);

          svg.selectAll("rect")
              .data(data1)
              .enter()
              .append("rect")
              .attr("x", (d, i) => i * 155)
              .attr("y", (d, i) => h - 10 * d-20)
              .attr("width",150)
              .attr("height", (d, i) => (d * 10)+20)
              .attr("fill", "blue");
              svg.selectAll("text")
        .data(data)
        .enter()
        .append('text')
        .text((item)=>{
          return item
        })
        .attr('y',(item,index)=>{
          return (h-10*item.total)-3
        })
        .attr('x',(item,index)=>{
          return index*200
        })
    })

    fetch('https://thawing-cliffs-23888-c80efe02f60e.herokuapp.com/v1/averagetime/') 
    .then(res => res.json()) 
    .then(res => {
      var aux = res.total;
      var lab="";
      var seg=0,min=0,hrs=0;
      if(aux>3600)
      {
        hrs=Math.trunc(aux/3600);
        aux=aux-(hrs*3600);
      }
      if(aux>60)
      {
        min=Math.trunc(aux/60);
        aux=aux-(min*60);
      }
      seg=Math.trunc(aux);
      lab=hrs+" h "+min+" m "+seg+" s";
      setAveragetime(lab)
    });
    fetch('https://thawing-cliffs-23888-c80efe02f60e.herokuapp.com/v1/topterm/') 
    .then(res => res.json()) 
    .then(res => {
      console.log(res);
      listTerms=res.top.map((term,index) =>
      <Box id={`box-${index}`}><Typography variant="epsilon">{term}</Typography></Box>
      );
      setTopterms(listTerms);
    });
    fetch('https://thawing-cliffs-23888-c80efe02f60e.herokuapp.com/v1/lastchanges/') 
    .then(res => res.json()) 
    .then(res => {
      console.log(res);
      listChanges=res.user.map((change,index) =>
      <Tr><Td><Typography style={{display:'flex',justifyContent:'space-between'}} textColor="neutral800">{Date.parse(change.updated_at)>Date.parse(change.created_at)?change.updated_by+" updated":change.created_by+" created"} {change.text} on the {Date.parse(change.updated_at)>Date.parse(change.created_at)?change.updated_at.replace('T',' ').replace('Z',' '):change.created_at.replace('T',' ').replace('Z',' ')}<Link href={"https://dictionary.linarys.com/admin/content-manager/collectionType/api::term.term/"+change.id}>SEE DETAILS</Link></Typography></Td></Tr>
      );
      setLast(listChanges);
    });
    fetch('https://thawing-cliffs-23888-c80efe02f60e.herokuapp.com/v1/topmissing/') 
    .then(res => res.json()) 
    .then(res => {
      console.log(res);
      listMissing=res.top.map((term,index) =>
      <Box id={`box-${index}`}><Typography variant="epsilon">{term}</Typography></Box>
      );
      setTopMissing(listMissing);
    });   
  }, []);
  return (
    <Layout>
      <BaseHeaderLayout
        title="Metrics"
        subtitle="All you want to measure about your app"
        as="h2"
      />
      <ContentLayout>
        <Box padding={[11, 6, 1]}  shadow="tableShadow">
            <Box padding={4} hasRadius background="neutral100" key={`chart`} id="chart" shadow="tableShadow">
              <div id={"#chart"}></div>
            </Box>
        </Box>
        <GridLayout>
          <Box padding={8} >
            <GridLayout>
              <Box padding={4} hasRadius background="neutral100" key={`searched-terms`} >
                <Box><Typography variant="alpha">Top 10 Searched Terms</Typography></Box>
                {topterms}
              </Box>
            </GridLayout>
          </Box>
          <Box padding={8} >
            <GridLayout>
              <Box padding={4} hasRadius background="neutral100" key={`missing-terms`} >
                <Box><Typography variant="alpha">Top 5 missing Terms</Typography></Box>
                {topMissing}
                <Box><Typography variant="alpha">{averagetime}</Typography></Box>
                <Box><Typography variant="epsilon">Average time used</Typography></Box>
              </Box>
             
            </GridLayout>
          </Box>
        </GridLayout>
        <Box padding={8} background="neutral100">
        <Table background="neutral100">
          <Thead>
            <Tr>
              <Th>
              <Typography variant="alpha">Last administrative changes</Typography>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {last}
          </Tbody>
        </Table>
      </Box>
      </ContentLayout>
    </Layout>
  );
};

export default HomePage;

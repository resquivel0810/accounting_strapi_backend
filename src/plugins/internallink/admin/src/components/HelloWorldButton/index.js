import React from "react";
import { Button } from "@strapi/design-system/Button";
import { useCMEditViewDataManager } from "@strapi/helper-plugin";
import {useState} from 'react';
import {useEffect} from 'react';

// module.exports = ({ strapi }) => ({
//   async find() {
//     return await strapi.db.query('api::term.term').findOne({
//       select: ['definition'],
//       where: { id: 1 },
//     });
//   },
// });

const HelloWorldButton = () => {
  var txt=window.location.pathname.split('/');
    var n=txt[txt.length - 1];
    //const [id, setId] = useState(null);
    const { initialData } = useCMEditViewDataManager();
    function internalLink() {
      var selected=tinymce.activeEditor.selection.getContent();
      var aux="";
      var aux1=selected;
      selected=selected.replace('[','');
      selected=selected.replace(']','');
      selected=selected.replace('[','');
      selected=selected.replace(']','');
      var mul=selected.indexOf('|');
      if(mul>0){
        aux=selected.split('|');
        selected=aux[1];
      }

      fetch('https://thawing-cliffs-23888-c80efe02f60e.herokuapp.com/v1/folioid/'+selected) 
      .then(res => res.json()) 
      .then(res => {
        var id=res.user;
        if(id!=null) {
          if(id!=0){
            var content = tinymce.activeEditor.getContent();
            if(mul>0){
                content=content.replace(aux1,"<a href='/dictionary/"+id+"'>"+aux[0]+"</a>");
            }else{
                content=content.replace(aux1,"<a href='/dictionary/"+id+"'>"+selected+"</a>");
            }
            tinymce.activeEditor.setContent(content);
          }
          else{
            alert("The term '"+selected+"' does not exist");
          }
        }
        else{
          alert("Formatted error");
        }
      });
    }
    return (
      <Button
        variant="secondary"
        onClick={() => internalLink() }
      >
        Internal link
      </Button>
    );
  };
  
  export default HelloWorldButton;
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
  Avatar,
  Status,
  Flex,
  Divider,
  Checkbox,
  Button,
  ModalLayout,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Switch,
  ProgressBar,
} from "@strapi/design-system/"
import {useState} from 'react';
import {useEffect} from 'react';
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';
function save(id,display){
  var data={
    "id":""+id,
    "display":""+display,
        };
  fetch('https://thawing-cliffs-23888-c80efe02f60e.herokuapp.com/v1/commentsDisplay/',{method: 'POST',
body: JSON.stringify(data)}) 
  .then(res => {console.log(res.json());location.reload();});
}
function watchindicator(id){
  fetch('https://thawing-cliffs-23888-c80efe02f60e.herokuapp.com/v1/commentWatched/'+id) 
  .then(res => {console.log(res.json());});
}
const HomePage = () => {
    const [comments, setComments] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [activated, setActivated] = useState(true);
    const [text, setText] = useState("");
    const [idComment, setIdcomment] = useState(0);
    const [display, setDisplay] = useState(null);
    const [watched, setWatched] = useState(null);
    var listItems;
    useEffect(() => {
        fetch('https://thawing-cliffs-23888-c80efe02f60e.herokuapp.com/v1/commentsCMS/') 
        .then(res => res.json()) 
        .then(
            res =>{ console.log(res);
            listItems = res.users.map((comment,index) =>
            <Box padding={4} hasRadius id={`box-${index}`} background="neutral0"  shadow="tableShadow">
            <Flex direction="column" alignItems="stretch" gap={3}>
                <Status variant={comment.consent==0 ? 'danger' : 'success'} size="S" showBullet={false}>
                    <Typography fontWeight="bold" textColor={comment.consent==0 ? 'danger700' : 'success200'}>
                        {comment.consent==0 ? 'Not Consent' : 'Consent'}
                    </Typography>
                </Status>
                {comment.watched==0 &&
                  <Status variant="danger" size="S" showBullet={false}>
                    <Typography fontWeight="bold" textColor="danger700" >
                        Unreaded
                    </Typography>
                  </Status>
                }
            </Flex>
            <Divider />
            <Box padding={4}><Avatar src={comment.picture} alt={comment.name} preview /><Typography variant="alpha">{comment.name}</Typography></Box>
                <Box padding={4} hasRadius background="neutral100"  shadow="tableShadow">
                    <Typography variant="omega">{comment.feedback}</Typography>
                </Box>
                <Box padding={2} background="neutral100">
                    <Typography variant="omega">Rate {comment.stars}/5</Typography>
                    <Box padding={2}>
                        <ProgressBar width="100" color="warning600"  value={20*comment.stars} size="M">{20*comment.stars}/100</ProgressBar>
                    </Box>
                </Box>
                {comment.consent==1 &&
                    <Box padding={2}><Checkbox  value={comment.display==0 ? false : true}>Display</Checkbox></Box>
                }
                {comment.consent==1 &&
                    <Button variant="secondary" fullWidth onClick={() =>{setIsVisible(prev => !prev);setActivated(comment.display==0 ? false : true);setText(comment.feedback);setIdcomment(comment.id);watchindicator(comment.id)} } >Display comment</Button>
                }
            </Box>
            );
            setComments(listItems);
            }
        );
        fetch('https://thawing-cliffs-23888-c80efe02f60e.herokuapp.com/v1/countCommentsDisplay/') 
        .then(res => res.json()) 
        .then(res => setDisplay(res.total));
        fetch('https://thawing-cliffs-23888-c80efe02f60e.herokuapp.com/v1/countCommentsWatched/') 
        .then(res => res.json()) 
        .then(res => setWatched(res.total));
      }, []);
      
  return (
    <Layout sideNav={undefined}>
      <BaseHeaderLayout
      title="Comments"
      subtitle="Here you can select your favorite comments and display them on the HomePage"
      as="h2"
      />
      <ContentLayout>
      <Box>
        <Flex alignItems="center">
          <Status variant="warning" showBullet={true}>
            <Typography>
              Comments displayed <Typography fontWeight="bold">{display}/10</Typography>
            </Typography>
          </Status>
          <Status variant="warning" showBullet={true}>
            <Typography>
              You have <Typography fontWeight="bold">{watched}</Typography> unread comments
            </Typography>
          </Status>
        </Flex>
      </Box>
      <Box padding={8} background="neutral100">
      <GridLayout>
      {comments}
      {isVisible && <ModalLayout onClose={() => setIsVisible(prev => !prev)} labelledBy="title">
            <ModalHeader>
              <Typography fontWeight="bold"  as="h1" id="title">
                Display the coment
              </Typography>
            </ModalHeader>
            <ModalBody>
            <Box>
                <Typography fontWeight="bold"  as="h2" id="subtitle">
                    Do you want to display the next comment?
                </Typography>
            </Box>
            <Box>
                <Typography fontWeight="bold"  >
                    {text}
                </Typography>
            </Box>
            <Switch label="Display the comment" selected={activated} onChange={() => setActivated(s => !s)} visibleLabels />
            </ModalBody>
            <ModalFooter startActions={<Button onClick={() => setIsVisible(prev => !prev)} variant="danger">
                  Cancel
                </Button>} endActions={<>
                  <Button onClick={() => {setIsVisible(prev => !prev);save(idComment,activated ? 1 : 0)}} variant="success">Save</Button>
                </>} />
          </ModalLayout>}
      </GridLayout>
    </Box>
      </ContentLayout>
    </Layout>
  );
};

export default HomePage;



import styled from "styled-components";
import PostTwitForm from "../components/post-twit-form";
import Timeline from "../components/timeline";

const Wrapper = styled.div`
  display: grid;
  gap: 50px;
  //overflow-y: scroll;
  grid-template-rows: 1fr 5fr;
  
`;


export default function Home() {
  return (
    <Wrapper>
      <PostTwitForm />
      <Timeline />
    </Wrapper>
  );
}
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Twit from "./twit";
import { Unsubscribe } from "firebase/auth";

export interface ITwit{ // interface는 타입체크를 위해 사용됨
  id:string;
  photo?:string;
  twit:string;
  userId:string;
  username:string;
  createdAt:number;
}

const Wrapper=styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  overflow-y: scroll;
`;


export default function Timeline(){
  const [twits, setTwit]=useState<ITwit[]>([]);
  
  useEffect(()=>{ // 유저가 이 페이지에 들어와서 타임라인 컴포넌트가 마운트될때 구독되고 언마운트되면 구독 취소하는 것
    let unsubscribe:Unsubscribe| null=null;
    const fetchTwits=async()=>{
    const twitsQuery=query(
      collection(db, "twits"),
      orderBy("createdAt", "desc"),
      limit(25)
    );
    /* const snapshot=await getDocs(twitsQuery);
    const twits= snapshot.docs.map((doc) => {
      const {twit, createdAt, userId, username, photo}= doc.data();
      return {
        twit, createdAt, userId, username, photo, id:doc.id,
      };
    }); */
    unsubscribe=await onSnapshot(twitsQuery, (snapshot)=>{ //사용자가 자리 비울때는 이벤트 변화를 읽어오지 않음
      const twits=snapshot.docs.map((doc) => {
        const {twit, createdAt, userId, username, photo}= doc.data();
        return {
          twit, createdAt, userId, username, photo, id:doc.id,
        };
      });
      setTwit(twits);
    });
  };
    fetchTwits();  // 컴포넌트가 렌더링될 때마다 특정 작업을 실행할 수 있도록 하는 Hook
    return()=>{
      unsubscribe &&unsubscribe();      
    }
  },[]);  // 빈 괄호를 쓰면 처음 렌더링 될 떄 한번만 실행
  return(
    <Wrapper>
      {twits.map(twit=><Twit key={twit.id} {...twit}/>)}
    </Wrapper>
  );
}
import styled from "styled-components";
import { ITwit } from "./timeline";
import { auth, db, storage } from "../firebase";
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { AttachFileInput } from "./post-twit-form";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div``;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const Form = styled.form`
  display: grid;
  flex-direction: column;
  gap: 10px;
`;

const EditButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  margin-left: 10px; 
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const CancelButton = DeleteButton;
const SaveButton = styled.input`
  background-color: #1d9bf0;
  color: white;
  font-weight: 600;
  border: 0;
  margin-left: 10px; 
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const EditPayload = styled.textarea`
  margin: 20px 0;
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 90%;
  resize: none;font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;

  &::placeholder{
    font-size: 16px;
    }
  &:focus{
    outline: none;
    border-color: #1d9bf0;
  }
`;

const AttachFileButton = styled.label`
  background-color: #1d9bf0;
  color: white;
  font-weight: 600;
  border: 0;
  margin-left: 10px; 
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
  
`;

export default function Twit({ username, photo, twit, userId, id }: ITwit) {
  const [isEditing, setEditing] = useState(false);
  const [newTwit, setNewTwit] = useState(twit);
  const [newFile, setNewFile] = useState<File | null>(null);
  const user = auth.currentUser;

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewTwit(e.target.value);
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      if (files[0].size > 1000000) {
        alert("File size is too big. Please choose another one.");
        setNewFile(null);
      } else setNewFile(files[0]);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || newTwit === "" || newTwit.length > 180) return;

    try {
      const newDoc = {
        twit: newTwit,
        createdAt: Date.now(),
      };
      await updateDoc(doc(db, "twits", id), newDoc);
      if (newFile) {
        const locationRef = ref(storage, `twits/${user.uid}/${id}`);
        const result = await uploadBytes(locationRef, newFile);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc(db, "twits", id), {
          photo: url,
        });

      }
      setNewTwit("");
      setNewFile(null);
      setEditing(false);
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete this twit?");

    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "twits", id));
      if (photo) {
        const photoRef = ref(storage, `twits/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    } finally {

    };
  };

  const onEdit = async () => {
    setEditing(true);
  };
  const onCancel = async () => {
    const ok = confirm("Are you sure you want to cancel this twit?");

    if (ok) {
      setNewFile(null);
      setNewTwit(twit);
      setEditing(false);
      return;
    }
  };

  return (<>
    {isEditing ?
      <Wrapper>
        <Form onSubmit={onSubmit}>
          <Column>
            <Username>{username}</Username>
            <EditPayload
              required
              rows={5}
              maxLength={180}
              onChange={onChange} value={newTwit} placeholder="What is happening?!"></EditPayload>

            {user?.uid === userId ? <CancelButton onClick={onCancel}>Cancel</CancelButton> : null}
            {user?.uid === userId ? <SaveButton type="submit" value="SAVE"/> : null}
            <AttachFileButton htmlFor="newfile">{newFile ? "Photo edited ✅" : "Edit photo"}</AttachFileButton>
            <AttachFileInput onChange={onFileChange} type="file" id="newfile" accept="image/*" />
            

          </Column>
        </Form>
        <Form>
          <Column>
            {photo ? (
              <Photo src={photo} />
            ) : null}
          </Column>
        </Form>
      </Wrapper>
      :
      <Wrapper>
        <Column>
          <Username>{username}</Username>
          <Payload>{twit}</Payload>
          {user?.uid === userId ? <DeleteButton onClick={onDelete}>Delete</DeleteButton> : null}
          {user?.uid === userId ? <EditButton onClick={onEdit}>Edit</EditButton> : null}

        </Column>
        <Column>
          {photo ? (
            <Photo src={photo} />
          ) : null}
        </Column>
      </Wrapper>
    }
  </>

  );
}
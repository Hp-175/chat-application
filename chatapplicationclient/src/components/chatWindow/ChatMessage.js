import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader } from 'reactstrap';
import './chatWindowStyles.css';
import { baseUrl } from '../../shared/baseUrl';
import axios from 'axios';

function ShowDeleteArrow({ type, toggleModal, modelOpen, deleteChat, classname }) {
  if (type === 'sender') {
    return (
      <>
        <div className={`${classname}`} onClick={toggleModal} > <i className="fas fa-chevron-down fa-xs"></i>
          <Modal isOpen={modelOpen} toggle={toggleModal} contentClassName='deleteChatModel' isClearable={false}>
            <ModalHeader toggle={toggleModal}><button onClick={() => { deleteChat(); toggleModal(); }} className='deleteChatBtn'>Delete msg</button></ModalHeader>
          </Modal>
        </div>

      </>
    )
  } else {
    return (
      <></>
    )
  }
}

function ChatMessage(props) {

  const [modelOpen, setState] = useState(false);
  const [imgURL, setURL] = useState(baseUrl + 'Files/download.png');

  function toggleModal() {
    setState(!modelOpen);
  }

  async function deleteChat() {
    await props.deleteChat(props._id);
    props.last('newOne');
    props.socket.emit("sendMessage", {
      senderId: props.userId,
      receiverId: props.receiverId
    });
  }

  const handleDownload = async (url, filename) => {
    const bearer = 'Bearer ' + localStorage.getItem('token');
    const res = await axios.get(url, {
      headers: {
        'Authorization': bearer
      },
      responseType: 'blob',
    });

    const urln = window.URL.createObjectURL(new Blob([res.data], { type: filename.split('.')[-1] }));

    const link = document.createElement('a');
    link.href = urln;

    link.download = filename;
    link.click();
  }

  useEffect(() => {
    const getUrl = async (url, filename) => {
      try {
        const bearer = 'Bearer ' + localStorage.getItem('token');
        const res = await axios.get(url, {
          headers: {
            'Authorization': bearer
          },
          responseType: 'blob',
        });
        // console.log(res);
        const urln = window.URL.createObjectURL(new Blob([res.data], { type: filename.split('.')[-1] }));
        setURL(urln);
      } catch (err) {
        console.log(err);
      }
    }
    if (props.File.filename !== "Not a file") {
      getUrl(baseUrl + 'UploadFile/download/' + props.File.filename, props.File.filename);
      // console.log(props.File.filename);
    }

  }, []);


  if (props.data === 1) {
    return (
      <div key={props.index} className={`msgDiv ${props.type}`} >
        <div className='text'>{props.info}</div>
        <div className='time'>
          <div className='timeContent'>{props.time}</div>
        </div>
        <ShowDeleteArrow
          type={props.type}
          toggleModal={toggleModal}
          modelOpen={modelOpen}
          deleteChat={deleteChat}
        />
      </div>
    );
  }
  else {

    let ext = props.File.title.slice(props.File.title.lastIndexOf(".") + 1, props.File.title.length);
    if (ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'gif' || ext === 'jfif' || ext === 'PNG' || ext === 'JPG' || ext === 'JPEG' || ext === 'JFIF') {
      return (
        <div key={props.index} className={`msgDivImage ${props.type}`}>
          <div className="card">
            <img width="100%" src={imgURL} alt={props.File.title} />
            <ShowDeleteArrow
              type={props.type}
              toggleModal={toggleModal}
              modelOpen={modelOpen}
              deleteChat={deleteChat}
              classname={'deleteArrowImage'}
            />
            <div className='timeImage'>
              <div className='timeContentImage'>{props.time}</div>
              <div className='downloadBtnImage' onClick={() => handleDownload(baseUrl + 'UploadFile/download/' + props.File.filename, props.File.filename)}>
                <i className="fa fa-arrow-down downloadBtnImage"></i>
              </div>

            </div>
          </div>
        </div>
      );
    }
    else {
      return (
        <div key={props.index} className={`msgDiv ${props.type}`} >
          <div className='File'>{props.File.title}</div>
          <div className='time'>
            <div className='timeContent'>{props.time}</div>
          </div>
          <div className='downloadBtn'>
            <div className='downloadBtn' onClick={() => handleDownload(baseUrl + 'UploadFile/download/' + props.File.filename, props.File.filename)}>
              <i className="fa fa-arrow-down downloadBtn"></i>
            </div>
          </div>
          <ShowDeleteArrow
            type={props.type}
            toggleModal={toggleModal}
            modelOpen={modelOpen}
            deleteChat={deleteChat}
          />
        </div>
      );
    }
  }
}

export default ChatMessage;
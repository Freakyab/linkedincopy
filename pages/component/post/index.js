import React, { useEffect } from "react";
import { storageRef } from "../../../base"
import style from "./index.module.css";
import { HiUserCircle } from "react-icons/hi";
import { AiFillLike } from "react-icons/ai";
import { RiEarthFill } from "react-icons/ri";
import { FiMoreHorizontal } from "react-icons/fi";
import { FaRegCommentDots, FaUnderline } from "react-icons/fa";
import { IoMdShareAlt } from "react-icons/io";
import { RiSendPlaneFill } from "react-icons/ri";
import { MdPhotoSizeSelectActual, MdSmartDisplay, MdEventNote, MdArticle } from "react-icons/md";
import axios from "axios";

const Post = (props) => {
    const [dateTime, setDateTime] = React.useState("")
    const [downloadUrls, setDownloadUrls] = React.useState([]);
    const [feed, setFeed] = React.useState([])
    const [objectData, setObjectData] = React.useState([0])
    const [update, setUpdate] = React.useState(true);
    const [text, setText] = React.useState("")

    const handlechange = (e) => {
        setText(e.target.value)
    }
    
    const fetchImages = async () => {
        try {
            const result = await storageRef.child(`image/${props.id}`).listAll();
            const urls = await Promise.all(
                result.items.map(async (imageRef) => {
                    const downloadUrl = await imageRef.getDownloadURL();
                    return downloadUrl;
                })
            );
            setDownloadUrls(urls);
            setUpdate(false);
        } catch (error) {
            console.error(error);
        }
    };
    async function feedData() {
        console.log(props.id)
        await axios.get(`https://api-dusky-pi.vercel.app/Linkedin/returnData?userId=${props.id}`)
            .then((res) => {
                setFeed(res.data)
                setObjectData(res.data.post)
            })
    }
    const apifetch = async (id) => {
        await axios.get(`https://api-dusky-pi.vercel.app/Linkedin/post?userId=${id}&caption=${ text }`)
            .then((res) => {
                setObjectData(res.data.post)
            }).catch((err) => {
                console.log(err)
            })
    }
    const getTime = () => {
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var datetime = date;
        setDateTime(datetime)
    }
    const onchange = async (e) => {
        if (e.target.files[0] === undefined) {
            return;
        }
        if (!text) {
            alert("Input field is empty");
            return;
          }
          getTime();
        const file = e.target.files[0];
        const result = await storageRef.child(`image/${props.id}`).listAll();
        let fileRef;
        if (result.items.length === 0|| undefined|| null) {
          fileRef = storageRef.child("image/" + props.id + "/" + 1);
        } else {
          fileRef = storageRef.child("image/" + props.id + "/" + (result.items.length + 1));
        }
        fileRef
          .put(file)
          .then(() => {
            console.log("Uploaded a file");
            setText("")
            apifetch(props.id);
            setUpdate(!update);
          })
          .catch((error) => {
            console.error(error);
          });
        console.log(file);
        return dateTime;
      };
    useEffect(() => { 
       getTime();
        if(update)
        {
            feedData()
            fetchImages()
        }
        
    }
        , [update,objectData])

    return (
        <>

        <div className={style.mainwrapper}>
        <div className={style.newpost}>
          <div className={style.textpost}>
            <span>
              <HiUserCircle size="4rem" />
            </span>
            <span>
              <input type="text" placeholder="Start a post" value={text} onChange={handlechange}/>
            </span>
          </div>
          <div className={style.otherpost}>
            <span>
              <MdPhotoSizeSelectActual color="lightblue" size="1.5rem" />
              <input type="file" className={style['input-file']} onChange={onchange} /><span>Post</span>
            </span>
            <span>
              <MdSmartDisplay color="green" size="1.5rem" /> <span>Video</span>
            </span>
            <span>
              <MdEventNote color="brown" size="1.5rem" /> <span>Event</span>
            </span>
            <span>
              <MdArticle color="orangered" size="1.5rem" />{" "}
              <span>Write article</span>
            </span>
          </div>
        </div>
          
            {downloadUrls === undefined ? null : downloadUrls.map((url, index) => (
        <div style = {{display : "flex" , justifyContent : "center"}}>
                
                <div className={style.feed}>

                    <div className={style.feedpostcard}>
                        <div className={style.feedpostcardheader}>
                            <div className={style.feedpostcardheaderleft}>
                                <span>
                                    <HiUserCircle size="3rem" />
                                </span>
                                <span>
                                    {/*  */}
                                    <h3>{feed.Name}</h3>
                                    {/*  */}
                                    {/* <p>{feed.about}</p> */}
                                    <p>
                                        <span> {dateTime} • </span>
                                        <RiEarthFill />
                                    </p>
                                </span>
                            </div>
                            <div className={style.feedpostcardheaderright}>
                                <span>
                                    <FiMoreHorizontal size="1.2rem" />
                                </span>
                            </div>
                        </div>
                        <div key={index} className={style.feedpostcardbody}>
                                <img src={url} alt="downloaded" style={{ width: "50vw" ,height : "50vh"}} />
                            <p>{objectData[0][index+1]}</p>
                            {/* {console.log("object",objectData)} */}
                        </div>
                        <div className={style.feedpostcardfooter}>
                            <ul>
                                <li>
                                    <AiFillLike size="1.5rem" />
                                    <span>Like</span>
                                </li>
                                <li>
                                    <FaRegCommentDots size="1.5rem" />
                                    <span>Comment</span>
                                </li>
                                <li>
                                    <IoMdShareAlt size="2rem" />
                                    <span>Share</span>
                                </li>
                                <li>
                                    <RiSendPlaneFill size="1.5rem" />
                                    <span>Send</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            ))}
        </div>
        </>
    );
};

export default Post;

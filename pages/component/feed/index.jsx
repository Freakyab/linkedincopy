import React, { useEffect, useState } from 'react';
import { storageRef } from "../../../base"
import { HiUserCircle } from "react-icons/hi";
import { AiFillLike } from "react-icons/ai";
import { RiEarthFill } from "react-icons/ri";
import { FiMoreHorizontal } from "react-icons/fi";
import { FaRegCommentDots } from "react-icons/fa";
import { IoMdShareAlt } from "react-icons/io";
import { RiSendPlaneFill } from "react-icons/ri";
import { MdPhotoSizeSelectActual, MdSmartDisplay, MdEventNote, MdArticle } from "react-icons/md";
import axios from "axios";
import { LazyLoadImage } from 'react-lazy-load-image-component';


import style from "../post/index.module.css"
const Feed = (props) => {
  const [update, setUpdate] = useState(true);
  const [feed, setFeed] = useState([]);
  const [username, setUsername] = useState([]);
  const [like, setLike] = useState([]);
  const [ids, setIds] = useState([]);
  const [keys, setKeys] = useState([]);
  const [caption, setCaption] = useState([]);
  const [urls, setUrls] = useState([]);
  const [render, setRender] = useState(false);


  const getImages = async () => {
    if (keys.length === 0) {
      return;
    } else {
      const newUrls = [];
      for (let i = 0; i < keys.length; i++) {
        const imageRef = storageRef.child(`image/${ids[i]}/${keys[i]}`);
        const downloadUrl = await imageRef.getDownloadURL();
        newUrls.push(downloadUrl);
      }
      setUrls(newUrls);
    }
  };

  const LikePostData = async (indexNo) => {
    console.log(indexNo)
    console.log(like[indexNo])
    console.log(username[indexNo])
    if(like[indexNo].includes(username[indexNo]))
    {
      console.log(0)
     await axios.get(`https://api-dusky-pi.vercel.app/Linkedin/like?userId=${props.id}&like=0&index=${indexNo}&likeId=${ids[indexNo]}`)
        .then((res) => {
            console.log(res.data)
            // render page after getting data
            console.log(render, "render")
           setRender(true)
        }).catch((err) => {
            console.log(err)
        })
    }
    else{
      console.log(1)
        await axios.get(`https://api-dusky-pi.vercel.app/Linkedin/like?userId=${props.id}&like=1&index=${indexNo}&likeId=${ids[indexNo]}`)
        .then((res) => {
            console.log(res.data)
            // render page after getting data
            setRender(true, "render")
        }).catch((err) => {
            console.log(err)
        })
    }
}

  const feedData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/Linkedin/feed?no=7');
      setFeed(res.data.post);
      // setKeys(Object.values(res.data.post[0]));
      // setCaption(res.data.post[1]);
      // setUsername(res.data.post[2]);
      // setIds(Object.values(res.data.post[3]));
      // setLike(res.data.post[4]);
      setData(res.data.post);
      setUpdate(false);
    } catch (error) {
      console.log(error);
    }
  };

  const setData = async (data) => {
    setKeys(Object.values(data[0]));
      setCaption(data[1]);
      setUsername(data[2]);
      setIds(Object.values(data[3]));
      setLike(data[4]);
  }

  useEffect(() => {
    if(render){
      setData(feed);
      setRender(false);
    }
    if (update) {
      feedData();
    }
  }, [update,render]);

  useEffect(() => {
    if (keys.length > 0) {
      getImages();
    }
  }, [keys]);

  return (
    <>
      {urls === undefined ? null :urls.map((url, index) => (
      <div style={{ display: "flex", justifyContent: "center" }}>

        <div className={style.feed}>

          <div className={style.feedpostcard}>
            <div className={style.feedpostcardheader}>
              <div className={style.feedpostcardheaderleft}>
                <span>
                  <HiUserCircle size="3rem" />
                </span>
                <span>
                  {/*  */}
                  <h3>{username[index+1]}</h3>
                  {/*  */}
                  {/* <p>{feed.about}</p> */}
                  <p>
                    {/* <span> {dateTime} • </span> */}
                    <RiEarthFill />
                  </p>
                </span>
              </div>
              <div className={style.feedpostcardheaderright}>
                <span>
                  <FiMoreHorizontal
                    key={index} 
                    size="1.2rem"
                  //  onClick={() => {
                  //   handleMenuClick(index)
                  //   setDisplay(!display)
                  //   setIndexNo(index + 1)
                  // }} 
                  />
                </span>
              </div>
            </div>
            <div className={style.feedpostcardbody}>
              <LazyLoadImage
                src={url}
                //  effect="blur"
                // scrollPosition={scroll}
                style={{ width: "50vw", height: "50vh" }} />
              <p>{caption[index+1]}</p>
            </div>
            <div className={style.feedpostcardfooter}>
              <ul>
                <li>
                  <AiFillLike size="1.5rem"
                  onClick={() => {
                    LikePostData(index + 1)
                    setUpdate(false)}}
                  />
                  <span>Like</span>
                  {like ? (
                      <span>{like ? like[index + 1].length === 0 ? null : like[index + 1].length : null}</span>
                    ) : null}
                </li>
                <li>
                  <FaRegCommentDots size="1.5rem" />
                  <span>Comment</span>
                </li>
                <li>
                  <IoMdShareAlt size="2rem"
                  // onClick={() => {
                  //   navigator.clipboard.writeText(`http://localhost:3000/temp1/temp&${index + 1}`)
                  // }} 
                  />
                  <span>Share</span>
                </li>
                <li>
                  <RiSendPlaneFill size="1.5rem" />
                  <span>Send</span>
                </li>
              </ul>
            </div>
            {like ? (
                <span>{like ? like[index + 1].length === 0 ? null : like[index + 1][0] + ` and ${like[index + 1].length - 1} other` : null}</span>
              ) : null}
          </div>
        </div>
      </div>
       ))} 
    </>
  );
};
export default Feed;

import React, { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import storage from "../../firebaseConfig";
import style from "../post/index.module.css";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";

import { HiUserCircle } from "react-icons/hi";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { RiEarthFill } from "react-icons/ri";
import { FiMoreHorizontal } from "react-icons/fi";
import { FaRegCommentDots, FaUnderline } from "react-icons/fa";
import { IoMdShareAlt } from "react-icons/io";
import { RiSendPlaneFill } from "react-icons/ri";


function post1() {
  const router = useRouter();
  const { post } = router.query;
  console.log(post);
  const [data, setData] = React.useState([]);
  const [url, setUrl] = React.useState("");
  const [name, setName] = React.useState("");
  useEffect(() => {
    if (post !== undefined) {
      const postId = post.split("&")[1];
      const id = post.split("&")[0];
      console.log(post.split("&")[2])
      setName(post.split("&")[2]);
      fetch(`http://localhost:5000/testing/share?postId=${postId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      }).then(res => res.json())
        .then(result => {
          if (result.status) {
            console.log(result.post);
            setData(result.post);
            const storageRef = ref(storage, `images/${id}/${id} ${postId}.jpg`);
            getDownloadURL(storageRef)
              .then((downloadUrl) => {
                setUrl(downloadUrl);
              })
              .catch((error) => {
                console.log("Error getting download URL:", error);
              })

          }
        })
        .catch(err => console.log(err));
    }

  }, [post]);



  return (
    <>
      {
        url != "" ? (
          <div className={style.mainClass}>

            <div className={style.mainwrapper}>
              <div className={style.feed}>
                <div className={style.feedpostcard}>
                  <div className={style.feedpostcardheader}>
                    <div className={style.feedpostcardheaderleft}>
                      <span>
                        <HiUserCircle size="3rem" />
                      </span>
                      <span>
                        <h3>{data.name ?? null}</h3>
                        <p>
                          <span> {data.time ?? null}  • </span>
                          <RiEarthFill />
                        </p>
                      </span>
                    </div>
                    {/* <div className={style.feedpostcardheaderright}>
              
                  </div> */}
                  </div>
                  <div className={style.feedpostcardbody}>
                    <img src={url} alt="image" />
                    <p>{data?.caption ?? null}</p>
                  </div>
                  <div className={style.feedpostcardfooter}>
                    <ul className="cursor-pointer">
                      <li onClick={() => likePost(data._id)}>
                        {data.like.filter(e => e === name).length ? <AiFillLike size="1.5rem" className="text-blue-600" /> : <AiOutlineLike size="1.5rem" />}
                        <span>Like</span>
                      </li>
                      <li>
                        <FaRegCommentDots size="1.5rem" />
                        <span>Comment</span>
                      </li>
                      <li>
                        <IoMdShareAlt size="2rem" onClick={() => {
                          navigator.clipboard.writeText(`http://localhost:3000/temp1/temp&${index + 1}`)
                        }} />
                        <span>Share</span>
                      </li>
                      <li>
                        <RiSendPlaneFill size="1.5rem" />
                        <span>Send</span>
                      </li>
                    </ul>
                  </div>
                  <span>{data ? data.like.length > 1 ? `${data.like[data.like.length - 1]} and ${data.like.length - 1} likes` : `${data.like}` : null}</span>
                </div>
              </div>
            </div>
          </div>

        ) : null
      }
    </>
  )
}

export default post1

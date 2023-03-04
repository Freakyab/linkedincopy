import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { storageRef } from '../../base'
import style from "../component/post/index.module.css"

import { HiUserCircle } from "react-icons/hi";
import { AiFillLike } from "react-icons/ai";
import { RiEarthFill } from "react-icons/ri";
import { FiMoreHorizontal } from "react-icons/fi";
import { FaRegCommentDots, FaUnderline } from "react-icons/fa";
import { IoMdShareAlt } from "react-icons/io";
import { RiSendPlaneFill } from "react-icons/ri";
import axios from 'axios';

function post1() {
  const router = useRouter()
  const [Url, setUrls] = React.useState("")
  var pathData = router.asPath.split("&")
   pathData[0] = pathData[0].split("/")[2]
  const [ObjectData, setObjectData] = React.useState({})
  const [id, setId] = React.useState(null)

  const apifetch = async (fileName) => {
    console.log(fileName)
    console.log(pathData[0])
    await axios.get(`http://localhost:5000/Linkedin/specificPost?username=${pathData[0]}&filename=${fileName}`)
      .then((res) => {
        console.log(res.data)
        if (res.data.status === true)
        {
          setId(res.data.userId)
          setObjectData(res.data.post)
        }
        // else{
        //   router.push("/404")
        // }

      }).catch((err) => {
        console.log(err)
      })
  }

  const getImage = async (id, fileName) => {
    if (!id || fileName === "[post]") {
      return;
    } else {
      const imageRef = storageRef.child(`image/${id}/${fileName}`);
      const downloadUrl = await imageRef.getDownloadURL();
      setUrls(downloadUrl)
    }
  }

  useEffect(() => {
    apifetch(pathData[1]);
  }, [pathData[0]])

  useEffect(() => {
    getImage(id, pathData[1]);
  }, [id, pathData[1]])


  return (
    <>
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
                  {/* <h3>{feed.Name}</h3> */}
                  <h3>temp</h3>
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
                  <FiMoreHorizontal size="1.2rem" />
                </span>
              </div>
            </div>
            <div className={style.feedpostcardbody}>
              <img src={Url} alt="downloaded" style={{ width: "50vw", height: "50vh" }} />
              <p>{Object.keys(ObjectData).length !== 0 ? ObjectData[0][pathData[1]] : null}</p>

            </div>
            <div className={style.feedpostcardfooter}>
              <ul>
                <li>
                  <AiFillLike size="1.5rem" />
                  <span>Like</span>
                  <p>{Object.keys(ObjectData).length !== 0 ? ObjectData[1][pathData[1]] : null}</p>
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
    </>
  )
}

export default post1

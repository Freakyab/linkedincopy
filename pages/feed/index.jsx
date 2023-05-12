import React, { useState, useRef, useEffect } from 'react'
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import storage from "../../firebaseConfig";
import { HiUserCircle } from "react-icons/hi";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { RiEarthFill } from "react-icons/ri";
import { FiMoreHorizontal } from "react-icons/fi";
import { FaRegCommentDots, FaUnderline } from "react-icons/fa";
import { IoMdShareAlt } from "react-icons/io";
import { RiSendPlaneFill } from "react-icons/ri";

import axios from 'axios';
import style from "./../post/index.module.css"

const Feed = (props) => {
    const { setOnFeed, onFeed, id, name } = props;
    const [update, setUpdate] = useState(false);
    const [feedData, setFeedData] = useState([]);
    const [url, setUrl] = useState([]);
    const [liked, setLiked] = useState(false);
    const [userId, setUserId] = useState([]);

    const isRendered = useRef(false);

    const likePost = (postId) => {
        setLiked(true);
        fetch("http://localhost:5000/testing/like", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                postId: postId,
                userId: id
            })
        }).then(res => res.json())
            .then(data => {
                if (data.status) {
                    setFeedData(feedData.map(item => item._id === postId ? { ...item, like: data.like } : item));
                    setUpdate(!update);
                }
            })
            .catch(err => {
                console.log(err);
            }
            )
    }


    const fetchData = async () => {
        await axios.get(`http://localhost:5000/testing/feed?no=10&render=${liked}`)
            .then(res => {
                if (res.data.status) {
                    setFeedData(res.data.post);
                    setUserId(res.data.userId.filter(item => item.split(" ")[0] !== "undefined" && item.split(" ")[1] !== "undefined"));
                    res.data.userId.filter(item => item.split(" ")[0] !== "undefined" && item.split(" ")[1] !== "undefined").map(async (item, index) => {
                        const storageRef = ref(storage, `images/${item.split(" ")[0]}/${item}.jpg`);
                        const url = await getDownloadURL(storageRef);
                        setUrl((prevUrls) => [...prevUrls, url]);
                    })
                    setLiked(true);
                }
            })
            .catch(err => {
                console.log(err);
            })
    }



    useEffect(() => {
        if (isRendered.current) {
            fetchData();
        } else {
            isRendered.current = true;
        }

    }, [update]);

    return (
        <>
            <button onClick={() => setOnFeed(!onFeed)}>click me</button>
            <div className='flex flex-col justify-center content-center'>
                {feedData && feedData.map((item, index) => (
                    <div className={style.feed}>
                        <div className={style.feedpostcard}>
                            <div className={style.feedpostcardheader}>
                                <div className={style.feedpostcardheaderleft} key={index}>
                                    <span>
                                        <HiUserCircle size="3rem" />
                                    </span>
                                    <span>
                                        <h3>{item.name ?? null}</h3>
                                        <p>
                                            <span> {item.time ?? null}  • </span>
                                            <RiEarthFill />
                                        </p>
                                    </span>
                                </div>
                                <div className={style.feedpostcardheaderright}>
                                    {/* <span>
                                        <FiMoreHorizontal size="1.5rem" onClick={() => handleClick(index)} />
                                    </span> */}
                                </div>
                            </div>
                            <div className={style.feedpostcardbody}>
                                <img src={url[userId.findIndex(e => e.split(" ")[1] === item._id)]} alt="image" />
                                <p>{item?.caption ?? null}</p>
                            </div>
                            <div className={style.feedpostcardfooter}>
                                <ul className="cursor-pointer">
                                    <li onClick={() => likePost(item._id)}>
                                        {item.like.filter(e => e === name).length ? <AiFillLike size="1.5rem" className="text-blue-600" /> : <AiOutlineLike size="1.5rem" />}
                                        <span>Like</span>
                                    </li>
                                    <li>
                                        <FaRegCommentDots size="1.5rem" />
                                        <span>Comment</span>
                                    </li>
                                    <li>
                                        <IoMdShareAlt size="2rem" onClick={() => {
                                            navigator.clipboard.writeText(`http://localhost:3000/temp1/${item.userId}&${item._id}&${name}`);
                                        }} />
                                        <span>Share</span>
                                    </li>
                                    <li>
                                        <RiSendPlaneFill size="1.5rem" />
                                        <span>Send</span>
                                    </li>
                                </ul>
                            </div>
                            <span>{item ? item.like.length > 1 ? `${item.like[item.like.length - 1]} and ${item.like.length - 1} likes` : `${item.like}` : null}</span>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Feed;

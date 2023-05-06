import React, { useState, useEffect } from 'react'


import { HiUserCircle } from "react-icons/hi";
import { AiFillLike } from "react-icons/ai";
import { RiEarthFill } from "react-icons/ri";
import { FiMoreHorizontal } from "react-icons/fi";
import { FaRegCommentDots, FaUnderline } from "react-icons/fa";
import { IoMdShareAlt } from "react-icons/io";
import { RiSendPlaneFill } from "react-icons/ri";

import axios from 'axios';
import style from "./index.module.css"
const Profile = (props) => {
    const [update, setUpdate] = useState(false);
    const [display, setDisplay] = useState(false);
    const [ProfileData, SetProfileData] = useState([]);
    const [like, setLike] = useState([])


    const likePost = async (id, indexNo) => {
        await axios.get(`http://localhost:5000/testing/Like?userId=${props.id}&postId=${id}`)
            .then((res) => {
                setLike(like.map((e, index) => {
                    if (index === indexNo) {
                        return [
                            like[indexNo] = res.data.like
                        ]
                    }
                }))
                setUpdate(!update);
            })
    }

    const fetchData = async () => {
        await axios.get(`http://localhost:5000/testing/Feed?no=5`)
            .then(res => {
                SetProfileData(res.data.post)
                res.data.post.map((e) => {
                    setLike([...like, e.like])
                })
                setUpdate(true)
            })
    }

    const getTime = (time) => {
        console.log(time)
        const date = new Date();
        const secondDate = new Date(time)
        const newTime = date - secondDate;
        const seconds = Math.floor(newTime / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        // Calculate the remaining hours, minutes and seconds
        if (seconds < 60)
            return `${seconds} sec`
        else if (minutes < 60)
            return `${minutes} min`
        else if (hours < 24)
            return `${hours} hr`
        else if (days < 1)
            return `${days} day`
        return `${days} day`
    }

    useEffect(() => {
        fetchData()
    }, [])
    useEffect(() => {

    }, [update])

    return (
        <>
            <button onClick={() => { props.setOnFeed(!props.onFeed) }}>click </button>
            <h1>Feed</h1>
            {ProfileData === undefined ? null : ProfileData.map((e, index) => (
                <div style={{ display: "flex", justifyContent: "center" }}>

                    <div className={style.feed}>

                        <div className={style.feedpostcard}>
                            <div className={style.feedpostcardheader}>
                                <div className={style.feedpostcardheaderleft}>
                                    <span>
                                        <HiUserCircle size="3rem" />
                                    </span>
                                    <span>
                                        <h3>{ProfileData[index].name}</h3>
                                        <p>

                                            <span> {getTime(ProfileData[index].time)} • </span>
                                            <RiEarthFill />
                                        </p>
                                    </span>
                                </div>
                                <div className={style.feedpostcardheaderright}>
                                    {display ?
                                        <span onClick={() => {
                                            deletePost(ProfileData[index]._id)
                                        }}>
                                            delete
                                        </span> : null
                                    }
                                    <span>
                                        <FiMoreHorizontal key={index} size="1.2rem"
                                            onClick={() => {
                                                setDisplay(!display)
                                            }}
                                        />
                                    </span>
                                </div>
                            </div>
                            <div className={style.feedpostcardbody}>
                                <img
                                    src="https://random.imagecdn.app/500/150" effect="blur"
                                    scrollPosition={scroll}
                                    style={{ width: "50vw", height: "50vh" }} />
                                <p>{ProfileData[index].caption}</p>
                            </div>
                            <div className={style.feedpostcardfooter}>
                                <ul>
                                    <li>
                                        <AiFillLike size="1.5rem" onClick={() => {
                                            likePost(ProfileData[index]._id, index)
                                        }} />
                                        <span>Like</span>
                                        <span>{like === null ? null : like[index]}</span>
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

                            {like.length !== 0 ? <span>
                                {like[index]} is like
                            </span> : null}
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};

export default Profile;
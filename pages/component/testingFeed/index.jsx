import React, { useState, useRef, useEffect } from 'react'


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
    console.log(props.name)
    const [update, setUpdate] = useState(false);
    const [display, setDisplay] = useState(false);
    const [caption, setCaption] = useState("");
    const [ProfileData, SetProfileData] = useState([]);

    const likePost = async (id) => {
        await axios.get(`http://localhost:5000/testing/Like?userId=${props.id}&postId=${id}`)
            .then((res) => {
                console.log(res.data);
                setUpdate(!update);
            })
    }

    const deletePost = async (id) => {
        await
            axios.get(`http://localhost:5000/testing/DeletePost?userId=${props.id}&postId=${id}`)
                .then(
                    setUpdate(!update)
                )
    }

    const fetchData = async () => {
        await axios.get(`http://localhost:5000/testing/ProfileFeed?userId=${props.id}`)
            .then(res => {
                SetProfileData(res.data.post.reverse())
                setUpdate(true)
            })
    }

    const getTime = (time) => {
        const date = new Date();
        const secondDate = new Date(time)
        const newTime = date.getTime() - secondDate.getTime();
        const seconds = Math.floor(newTime / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        // Calculate the remaining hours, minutes and seconds
        if (seconds < 60)
            return `${seconds}sec`
        else if (minutes < 60)
            return `${minutes}min`
        else if (hours < 24)
            return `${hours}hr`
        else if (days < 1)
            return `${days}day`
        return newTime;
    }

    useEffect(() => {
        fetchData()
    }, [update])

    return (
        <>
            <button onClick={()=>{props.setOnFeed(!props.onFeed)}}>click </button>
            {ProfileData === undefined ? null : ProfileData.map((url, index) => (
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
                                        <h3>{ProfileData[index].name}</h3>
                                        {/*  */}
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
                                    // scrollPosition={scroll}
                                    style={{ width: "50vw", height: "50vh" }} />
                                <p>{ProfileData[index].caption}</p>
                            </div>
                            <div className={style.feedpostcardfooter}>
                                <ul>
                                    <li key = {Math.random()}>
                                        <AiFillLike size="1.5rem" onClick={() => {
                                            likePost(ProfileData[index]._id)
                                        }} />
                                        <span>Like</span>
                                        <span>{ProfileData[index].like.length}</span>
                                    </li>
                                    <li key = {Math.random()}>
                                        <FaRegCommentDots size="1.5rem" />
                                        <span>Comment</span>
                                    </li>
                                    <li key ={index}>
                                        <IoMdShareAlt size="2rem" onClick={() => {
                                            navigator.clipboard.writeText(`http://localhost:3000/temp1/temp&${index + 1}`)
                                        }} />
                                        <span>Share</span>
                                    </li>
                                    <li key = {Math.random()}>
                                        <RiSendPlaneFill size="1.5rem" />
                                        <span>Send</span>
                                    </li>
                                </ul>
                            </div>
                            <span>{ProfileData[index].like}</span>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};

export default Profile;
export async function getStaticProps(context) {
    const id = context.query.id;
    return {
        props: {
           name : id
        },
        revalidate: 1
    }
}
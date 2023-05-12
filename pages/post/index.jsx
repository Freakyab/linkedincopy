import { useState, useEffect, useRef } from "react";
import storage from "../../firebaseConfig";
import style from "./index.module.css";
import { HiUserCircle } from "react-icons/hi";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { RiEarthFill } from "react-icons/ri";
import { FiMoreHorizontal } from "react-icons/fi";
import { FaRegCommentDots } from "react-icons/fa";
import { IoMdShareAlt } from "react-icons/io";
import { RiSendPlaneFill } from "react-icons/ri";
import { MdPhotoSizeSelectActual, MdSmartDisplay, MdEventNote, MdArticle } from "react-icons/md";

// import axios from "axios";
import Dialog from "../component/dialog";
import { ref, listAll, getDownloadURL, deleteObject } from "firebase/storage";
// import { LazyLoadImage } from 'react-lazy-load-image-component';

const Post = (props) => {
    const { setOnFeed, onFeed, id } = props;
    const [img, setImg] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [caption, setCaption] = useState("");
    const [url, setUrl] = useState([]);
    const [update, setUpdate] = useState(false);
    const isRendered = useRef(false);
    const [displayImg, setDisplayImg] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [moreOption, setMoreOption] = useState([]);
    const [imgName, setImageName] = useState([]);
    const click = Array(url.length).fill(false);

    // handle clicks
    const handleChangeImg = (event) => {
        if (event.target.files && event.target.files[0]) {
            setImg(event.target.files[0]);
            setShowDialog(!showDialog);
            setDisplayImg(URL.createObjectURL(event.target.files[0]));
        }
    }

    const handleClick = (e) => {
        click[e] = !click[e];
        setMoreOption(click);
    }

    // For like

    const likePost = (postId) => {
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
                console.log(data);
                if (data.status) {
                    setUpdate(!update);
                }
            });
    }

    const deletePost = (postId) => {
        const storageRef = ref(storage, `images/${id}/${id} ${postId}.jpg`);
        deleteObject(storageRef)
            .then(() => {
                fetch("http://localhost:5000/testing/deletePost", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        postId: postId,
                        userId: id
                    })
                }).then(res => res.json())
                    .then(() => setUpdate(!update)).catch(err => {
                        console.log(err);
                    });
            })
            .catch((error) => {
                // Uh-oh, an error occurred!
                console.log(error);
            });

    }



    // fetch data
    const fetchData = async () => {
        const storageRef = ref(storage, `images/${id}`);
        listAll(storageRef)
            .then((res) => {
                res.items.forEach((itemRef) => {
                    // Get the download URL for each image
                    getDownloadURL(itemRef)
                        .then((url) => {
                            // Use the URL to display the image in your app
                            setUrl((prevUrls) => [...prevUrls, url]);
                            let name = itemRef.name.split(" ")[1].split(".")[0];
                            setImageName((previmgName) => [...previmgName, name])
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                });
            })
            .catch((error) => {
                console.log(error);
            }
            );
        fetch("http://localhost:5000/testing/profileFeed", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: id
            })
        }).then(res => res.json())
            .then(data => {
                console.log(data.post);
                if (data.status)
                    setProfileData(data.post);
            })
            .catch(err => {
                console.log(err);
            });

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
            <div className={showDialog ? "h-[100vh] pointer-events-none blur-md" : null}>
                <div className={style.mainClass}>
                    <div className={style.mainwrapper}>
                        <div className={style.newpost}>
                            <div className={style.textpost}>
                                <span>
                                    <HiUserCircle size="4rem" />
                                </span>
                                <span>
                                    <input type="text" placeholder="Start a post" onChange={(e) => setCaption(e.target.value)} value={caption} />
                                </span>
                            </div>
                            <div className={style.otherpost}>
                                <span>
                                    <MdPhotoSizeSelectActual color="lightblue" size="1.5rem" />
                                    <input type="file" className={style['input-file']} onChange={handleChangeImg} />
                                    <span>Photo</span>
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
                        <div className="flex flex-col">

                            {profileData && profileData.map((item, index) => (
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
                                                {moreOption[index] ?
                                                    <p className="cursor-pointer" onClick={() => deletePost(item._id, index)}
                                                    >delete</p>
                                                    : null}
                                                <span>
                                                    <FiMoreHorizontal size="1.5rem" onClick={() => handleClick(index)} />
                                                </span>
                                            </div>
                                        </div>
                                        <div className={style.feedpostcardbody}>
                                            <img src={url[imgName.findIndex(e => e === item._id)]} alt="image" />
                                            <p>{item?.caption ?? null}</p>
                                        </div>
                                        <div className={style.feedpostcardfooter}>
                                            <ul className="cursor-pointer">
                                                <li onClick={() => likePost(item._id)}>
                                                    {item.like.filter(e => e === item.name).length ? <AiFillLike size="1.5rem" className="text-blue-600" /> : <AiOutlineLike size="1.5rem" />}
                                                    <span>Like</span>
                                                </li>
                                                <li>
                                                    <FaRegCommentDots size="1.5rem" />
                                                    <span>Comment</span>
                                                </li>
                                                <li>
                                                    <IoMdShareAlt size="2rem" onClick={() => {
                                                        navigator.clipboard.writeText(`http://localhost:3000/temp1/${id}&${item._id}&${item.name}`)
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
                    </div>
                </div>
            </div>
            {img === null ? null : <Dialog {...{ img, setImg, setShowDialog, caption, setCaption, showDialog, id, setDisplayImg, displayImg, update, setUpdate }} />}
        </>
    );
};

export default Post;


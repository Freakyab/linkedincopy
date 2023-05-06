import { useState, useEffect, useRef } from "react";
import storage from "../../firebaseConfig";
import style from "./index.module.css";
import { HiUserCircle } from "react-icons/hi";
import { AiFillLike } from "react-icons/ai";
import { RiEarthFill } from "react-icons/ri";
import { FiMoreHorizontal } from "react-icons/fi";
import { FaRegCommentDots } from "react-icons/fa";
import { IoMdShareAlt } from "react-icons/io";
import { RiSendPlaneFill } from "react-icons/ri";
import { MdPhotoSizeSelectActual, MdSmartDisplay, MdEventNote, MdArticle } from "react-icons/md";

// import axios from "axios";
import Dialog from "../component/dialog";
import { ref, listAll, getDownloadURL } from "firebase/storage";
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
    // functions required
    const handleChangeImg = (event) => {
        console.log("running")
        if (event.target.files && event.target.files[0]) {
            setImg(event.target.files[0]);
            setShowDialog(!showDialog);
            setDisplayImg(URL.createObjectURL(event.target.files[0]));
            setUpdate(!update);
        }
    }

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
                if(data.status)
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
            <button onClick={() => [
                setOnFeed(!onFeed)
            ]}>click me</button>
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

                            {url && url.map((item, index) => (
                                <div className={style.feed} key={profileData[index].id}>
                                    <div className={style.feedpostcard}>
                                        <div className={style.feedpostcardheader}>
                                            <div className={style.feedpostcardheaderleft}>
                                                <span>
                                                    <HiUserCircle size="3rem" />
                                                </span>
                                                <span>
                                                    <h3>{profileData[index].name}</h3>
                                                    <p>
                                                        <span> {profileData[index].time} • </span>
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
                                            {console.log(item)}
                                            <img src={item} alt="image" />
                                            <p>{profileData[index].caption}</p>
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
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>
                </div>
            </div>
            {img === null ? null : <Dialog {...{ img, setImg, setShowDialog, caption, setCaption, showDialog, id, setDisplayImg, displayImg }} />}
        </>
    );
};

export default Post;


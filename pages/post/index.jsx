// Basic react component:
import { useState, useEffect, useRef } from "react";

//  FireBase data requiered
import storage from "../../firebaseConfig";
import { ref, listAll, getDownloadURL, deleteObject } from "firebase/storage";

// style used
import style from "./index.module.css";

// icons used
import { HiUserCircle } from "react-icons/hi";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { RiEarthFill, RiSendPlaneFill } from "react-icons/ri";
import { FiMoreHorizontal } from "react-icons/fi";
import { FaRegCommentDots } from "react-icons/fa";
import { IoMdShareAlt } from "react-icons/io";
import { MdPhotoSizeSelectActual, MdSmartDisplay, MdEventNote, MdArticle } from "react-icons/md";

// toastify used
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

// components used
import Dialog from "../component/dialog";

const Post = ({ setOnFeed, onFeed, id }) => {

    // states used
    const [img, setImg] = useState(null);                   // for image
    const [showDialog, setShowDialog] = useState(false);    // for dialog
    const [caption, setCaption] = useState("");             // for caption
    const [url, setUrl] = useState([]);                     // for url
    const [update, setUpdate] = useState(false);            // for update
    const [displayImg, setDisplayImg] = useState(null);     // for display image
    const [profileData, setProfileData] = useState(null);   // for profile data
    const [moreOption, setMoreOption] = useState([]);       // for more option
    const [imgName, setImageName] = useState([]);           // for image name

    // More option
    const click = Array(url.length).fill(false);

    // ref used
    const isRendered = useRef(false);

    // handle clicks
    const handleChangeImg = (event) => {

        // if image is selected
        if (event.target.files && event.target.files[0]) {

            // set image
            setImg(event.target.files[0]);

            // render dialog component
            setShowDialog(!showDialog);

            // set display image for dialog
            setDisplayImg(URL.createObjectURL(event.target.files[0]));
        }

    }

    // handle more option click
    const handleClick = (e) => {
        click[e] = !click[e];
        setMoreOption(click);
    }

    // handle notifcation click
    const msg = (type) => {
        if (type === "delete") {
            toast.success("Post Deleted", {
                position: "top-center",
                autoClose: 3000,
                closeOnClick: true,
            });
        }
        else if (type === "server") {
            toast.error("Something went wrong", {
                position: "top-center",
                autoClose: 3000,
                closeOnClick: true,
            });
        }
        else if (type === "upload") {
            toast.success("Post Uploaded", {
                position: "top-center",
                autoClose: 3000,
                closeOnClick: true,
            });
        }
    };

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
                if (data.status) {
                    setUpdate(!update);

                }
                else {
                    msg("server");
                }
            })
            .catch(err => {
                console.log(err);
                msg("server");
            }
            );

    }

    // For Delete
    const deletePost = (postId) => {

        // Create a reference to the file to delete
        const storageRef = ref(storage, `images/${id}/${id} ${postId}.jpg`);
        deleteObject(storageRef)
            .then(() => {

                // File deleted successfully
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
                    .then(() => setUpdate(!update))
                    .then(() => msg("delete"))
                    .catch(err => {
                        console.log(err);
                        msg("server");
                    }).catch((error) => {
                        // Uh-oh, an error occurred!
                        console.log(error);
                        msg("server");
                    });
            })
            .catch((error) => {
                // Uh-oh, an error occurred!
                console.log(error);
                msg("server");
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
                            msg("server");
                        });
                });
            })
            .catch((error) => {
                console.log(error);
                msg("server");
            });
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
                if (data.status)
                    setProfileData(data.post);
                else {
                    msg("server");
                }
            })
            .catch(err => {
                console.log(err);
                msg("server");
            });

    }
    // useEffect used
    useEffect(() => {
        if (isRendered.current) {

            fetchData();

        } else {
            isRendered.current = true;
        }
    }, [update]);


    return (
        <>
            {/* button for change to feed */}
            <button onClick={() => setOnFeed(!onFeed)}>click me</button>
            <div className={showDialog ? "h-[100vh] pointer-events-none blur-md" : null}>
                <div className={style.mainClass}>
                    <div className={style.mainwrapper}>
                        <div className={style.newpost}>

                            {/* profile image */}
                            <div className={style.textpost}>
                                <span>
                                    <HiUserCircle size="4rem" />
                                </span>
                                <span>
                                    <input type="text" placeholder="Start a post" onChange={(e) => setCaption(e.target.value)} value={caption} />
                                </span>
                            </div>

                            {/* other post */}
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

                        {/* feed */}
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

                                            {/* more option */}
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
                                            {/* Image */}
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
            {img === null ? null : <Dialog {...{ img, setImg, setShowDialog, caption, setCaption, showDialog, id, setDisplayImg, displayImg, update, setUpdate, setUrl, setImageName, msg }} />}
            <ToastContainer />
        </>
    );
};

export default Post;


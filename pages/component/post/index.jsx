import React, { useEffect } from "react";
import { storageRef } from "../../../base"
import style from "./index.module.css";
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


const Post = (props) => {
    const {setOnFeed,onFeed}   = props;
    const {windowScroll} = props;
    const scroll = windowScroll && windowScroll.scroll;
    // require data from database
    const [dateTime, setDateTime] = React.useState("")

    const [downloadUrls, setDownloadUrls] = React.useState([]);
    const [feed, setFeed] = React.useState([])
    const [objectData, setObjectData] = React.useState([{ 1: "caption" }])
    const [update, setUpdate] = React.useState(true);
    const [deletePost, setdeletePost] = React.useState(false);
    const [text, setText] = React.useState("")
    const [display, setDisplay] = React.useState(false)
    const [indexNo, setIndexNo] = React.useState(0)
    const [showMenuIndex, setShowMenuIndex] = React.useState(-1);
    const [like, setLike] = React.useState(null)

    // For lazy donwloading images

    // For post menu
    const handleMenuClick = (index) => {
        setShowMenuIndex(index === showMenuIndex ? -1 : index);
    };


    // for caption
    const handlechange = (e) => {
        setText(e.target.value)
    }


    // for post ftech image
    const fetchImages = async () => {
        try {
            const result = await storageRef.child(`image/${props.id}`).listAll();
            const urls = await Promise.all(
                result.items.map(async (imageRef) => {
                    const downloadUrl = await imageRef.getDownloadURL();
                    return downloadUrl;
                })
            );

            // getting all the urls of the images
            setDownloadUrls(urls);

            // observing the images for lazy loading

        } catch (error) {
            console.error(error);
        }
    };

    // for post data
    async function feedData() {
        await axios.get(`https://api-dusky-pi.vercel.app/Linkedin/returnData?userId=${props.id}`)
            .then((res) => {

                // for basic data of user
                setFeed(res.data)

                // for post data
                setObjectData(res.data.post)
                console.log(res.data.post)
                setLike(res.data.post[1])
                // to render page after getting data
                setUpdate(false)

                if(deletePost === true){
                    setdeletePost(false)
                }
                if(display === true){
                    setDisplay(false)
                }
            }).catch((err) => {
                console.log(err)
            })
    }

    // for post data api
    const apifetch = async (id) => {
        await axios.get(`https://api-dusky-pi.vercel.app/Linkedin/post?userId=${id}&caption=${text}&like=${like}`)
            .then((res) => {

                // object data is complete post data 
                setObjectData(res.data.post)
                
            }).catch((err) => {
                console.log(err)
            })
    }

    // for delete post

    const deletePostData = async (indexNo) => {

        // for delete image from storage
        const fileRef = storageRef.child(`image/${props.id}/${indexNo}`);
        try {
            await fileRef.delete();
            console.log(`File deleted successfully`);
        } catch (error) {
            console.error(`Error deleting file : `, error);
        }
        await axios.get(`https://api-dusky-pi.vercel.app/Linkedin/deletePost?userId=${props.id}&deletePost=${indexNo}`)
            .then((res) => {
                console.log(res.data)
                setdeletePost(true)
            }).catch((err) => {
                console.log(err)
            })

    }

    // for like post
    const LikePostData = async (indexNo) => {
        console.log(like[indexNo])
        if(like[indexNo].length === 0){
        await axios.get(`https://api-dusky-pi.vercel.app/Linkedin/like?userId=${props.id}&like=1&index=${indexNo}&likeId=${props.id}`)
            .then((res) => {
                console.log(res.data)
                // render page after getting data
                setUpdate(true)
            }).catch((err) => {
                console.log(err)
            })
        }else{
            console.log("already liked")
            await axios.get(`https://api-dusky-pi.vercel.app/Linkedin/like?userId=${props.id}&like=0&index=${indexNo}&likeId=${props.id}`)
            .then((res) => {
                console.log(res.data)
                // render page after getting data
                setUpdate(true)
            }).catch((err) => {
                console.log(err)
            })
        }
    }


    const getTime = () => {
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var datetime = date;
        setDateTime(datetime);
    }
    

    // for post image
    const onchange = async (e) => {
        
        // for empty input field
        if (e.target.files[0] === undefined) {
            return;
        }
        // for empty caption
        if (!text) {
            alert("Input field is empty");
            return;
        }
    
        getTime();
        
        const file = e.target.files[0];
        await apifetch(props.id);
        
        const result = await storageRef.child(`image/${props.id}`).listAll();
        let fileRef;
        if (result.items.length === 0 || undefined || null) {
            fileRef = storageRef.child("image/" + props.id + "/" + 1);
        } else {
            fileRef = storageRef.child("image/" + props.id + "/" + (result.items.length + 1));
        }
        fileRef
            .put(file)
            .then(() => {
                console.log("Uploaded a file");
                
                // reset caption
                setText("")

                // render page after getting data
                setUpdate(true);
            })
            .catch((error) => {
                console.error(error);
            });
        console.log(file);
        return dateTime;
    };


    useEffect(() => {
        
        getTime();
        if (update) {
            feedData()
            fetchImages()
        }

    }
        ,[update, objectData])


    useEffect(() => {
        if (deletePost) {
            fetchImages()
            feedData()
        }
    }, [deletePost])

    return (
        <>
        <button onClick = {()=>[
            setOnFeed(!onFeed)
        ]}>click me</button>
            <div className={style.mainClass}>
                <div className={style.mainwrapper}>
                    <div className={style.newpost}>
                        <div className={style.textpost}>
                            <span>
                                <HiUserCircle size="4rem" />
                            </span>
                            <span>
                                <input type="text" placeholder="Start a post" value={text} onChange={handlechange} />
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

                                            {display ? <span onClick={() => {
                                                deletePostData(indexNo)
                                                setIndexNo(index + 1)
                                            }}>
                                                deletePost
                                            </span> : null}
                                            <span>
                                                <FiMoreHorizontal key={index} size="1.2rem" onClick={() => {
                                                    handleMenuClick(index)
                                                    setDisplay(!display)
                                                    setIndexNo(index + 1)
                                                }} />
                                            </span>
                                        </div>
                                    </div>
                                    <div className={style.feedpostcardbody}>
                                        <LazyLoadImage
                                             src={url} effect = "blur" 
                                             scrollPosition={scroll} 
                                             style={{ width: "50vw", height: "50vh" }} />
                                        <p>{objectData === 0 ? null : objectData[0][index + 1]}</p>
                                    </div>
                                    <div className={style.feedpostcardfooter}>
                                        <ul>
                                            <li>
                                                <AiFillLike size="1.5rem" onClick={() => {
                                                    LikePostData(index + 1)
                                                    setUpdate(false)
                                                }} />
                                                <span>Like</span>
                                                {like ? (
                                                    <span>{like ? like[index+1].length === 0 ? null : like[index+1].length : null}</span>
                                                ) : null}
                                            </li>
                                            <li>
                                                <FaRegCommentDots size="1.5rem" />
                                                <span>Comment</span>
                                            </li>
                                            <li>
                                                <IoMdShareAlt size="2rem" onClick = {()=>{
                                                    navigator.clipboard.writeText(`http://localhost:3000/temp1/temp&${index+1}`)
                                                }}/>
                                                <span>Share</span>
                                            </li>
                                            <li>
                                                <RiSendPlaneFill size="1.5rem" />
                                                <span>Send</span>
                                            </li>
                                        </ul>
                                    </div>
                                    {like ? (
                                        <span>{like ? like[index+1].length === 0 ? null : like[index+1][0] + ` and ${like[index+1].length-1} other` : null}</span>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default  Post;


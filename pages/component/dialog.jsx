import Storage from "../../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { useState } from "react";

const Dialog = ({ img, setImg, setShowDialog, caption, setCaption, showDialog, id, setDisplayImg, displayImg, update, setUpdate  }) => {
    const uploadImage = (postId) => {
        const storageRef = ref(Storage, `images/${id}/${id} ${postId}.jpg`);
        const uploadTask = uploadBytesResumable(storageRef, img);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
                setCaption("");
                setImg(null);
                setShowDialog(!showDialog);
                setDisplayImg(null);
            },
            (error) => {
                console.log(error);

            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log("File available at", downloadURL);
                    setUpdate(!update)
                });
            }
        );

    }


    const postData = async () => {
        try {
            fetch("http://localhost:5000/testing/post", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    caption: caption,
                    userId: id
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.status) {
                        uploadImage(data.postId);
                        setUpdate(!update);
                    }
                });
        } catch (err) {
            console.log(err);
        }

    }
    return (

        <div className="fixed top-12 w-[500px] left-1/4 h-[500px] bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 shadow-lg shadow-black rounded-md p-2">
            <h1 className="text-4xl p-2"> Image</h1>
            <div className="h-[200px] w-full p-3">

                <img src={displayImg} alt="image" className="w-full h-full rounded-md shadow-sm" />

            </div>
            <h1 className="text-2xl p-2">Caption: </h1>
            <span className="p-2">
                <textarea className="w-96 h-[100px] rounded-md shadow-sm p-3" value={caption} onChange={(e) => setCaption(e.target.value)}></textarea>
            </span>
            <div className="flex justify-center p-2 gap-3">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded" onClick={() => {
                    postData();
                }}>Post</button>

                <button className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded" onClick={() => {
                    setImg(null);
                    setShowDialog(!showDialog)
                    setCaption("");
                    setDisplayImg(null);

                }}>Cancel</button>
            </div>
        </div>
    )
}

export default Dialog;

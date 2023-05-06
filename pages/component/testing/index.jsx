import React from 'react'
import styles from "./index.module.css"
import { AiOutlineHeart } from "react-icons/ai"
import { FiSend } from "react-icons/fi"
import { AiOutlineComment } from "react-icons/ai"
import { HiOutlineSaveAs } from "react-icons/hi"
import { TfiWorld } from "react-icons/tfi"

const index = () => {
    return (
        <>
            <div className={styles.mainDiv}>
                <div className={styles.post}>
                    <div className={styles.upperHeader}>
                        <TfiWorld size = {30}/>
                        <span>temp</span>
                    </div>
                    <div className={styles.postBody}>
                        <span className={styles.box1}>time</span>
                        <span className={styles.box2}>caption</span>
                        {/* <span className={styles.box3}>hastag</span> */}
                    </div>
                    <div className={styles.img}>
                        <img alt="this the image" />
                    </div>
                    <div className={styles.postFooter}>
                        <div className={styles.icon} >
                            <AiOutlineHeart size = {30}/>
                            <FiSend size = {30}/>
                            <AiOutlineComment size = {30}/>
                        </div>
                        <div className={styles.saveIcon}>
                            <HiOutlineSaveAs size = {30}/>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default index
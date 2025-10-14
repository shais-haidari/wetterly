import React, { useEffect, useState } from "react";
import { firestore } from "../firebase";
import { doc, getDoc, updateDoc, increment, setDoc } from "firebase/firestore";

const LikeButton = () => {
  const [likes, setLikes] = useState(0);
  const [clicked, setClicked] = useState(false);

  const likesDoc = doc(firestore, "likes", "websiteLikes");

  // Load likes from Firestore
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const docSnap = await getDoc(likesDoc);
        if (docSnap.exists()) {
          setLikes(docSnap.data().count || 0);
        } else {
          // Create document if it doesn't exist
          await setDoc(likesDoc, { count: 0 });
          setLikes(0);
        }
      } catch (err) {
        console.error("Error fetching likes:", err);
      }
    };
    fetchLikes();
  }, []);

  // Handle like click
  const handleLike = async () => {
    if (clicked) return; // prevent multiple clicks
    setClicked(true);

    try {
      await updateDoc(likesDoc, { count: increment(1) });
      setLikes((prev) => prev + 1);
    } catch (err) {
      console.error("Error updating likes:", err);
      setClicked(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 shadow-lg cursor-pointer hover:bg-red-600 transition-colors select-none">
      <button
        onClick={handleLike}
        className={`text-2xl ${clicked ? "text-red-500" : "text-white"} transition-colors`}
      >
        ❤️
      </button>
      <span className="text-white font-semibold text-lg">{likes}</span>
    </div>
  );
};

export default LikeButton;

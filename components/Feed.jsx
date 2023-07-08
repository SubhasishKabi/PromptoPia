"use client";

import { useState, useEffect } from "react";
import PromptCard from "./PromptCard";

//promptcard component(see below)
const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

export default function Feed() {
  const [posts, setPosts] = useState([]);
  //states for searching purposes
  const [searchText, setSearchText] = useState("");
  const [searchedresults, setSearchedresults] = useState([]);
  /*
  new RegExp(searchtext, "i"): This creates a new instance of the RegExp object. 
  The first argument, searchtext, is the regular expression pattern, and the second argument, 
  "i", is the flag specifying a case-insensitive search.
  */
  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext, "i");
    return posts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    );
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    const filteredPrompts = filterPrompts(e.target.value);
    setSearchedresults(filteredPrompts);
  };

  const handleTagClick = (tag) => {
    setSearchText(tag);
    const filteredPrompts = filterPrompts(tag);
    setSearchedresults(filteredPrompts);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/prompt");
      const data = await response.json();
      setPosts(data);
      // console.log(data);
    };
    fetchPosts();
  }, []);
  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        ></input>
      </form>
      {searchText ? (
        <PromptCardList
          data={searchedresults}
          handleTagClick={handleTagClick}
        />
      ) : (
        <PromptCardList data={posts} handleTagClick={handleTagClick} />
      )}
    </section>
  );
}

// eslint-disable-next-line no-unused-vars
import React from "react";

import { useState, useEffect } from "react";
import Modal from "react-modal";
import {MdOutlineDeleteForever} from "react-icons/md";

import { copy, linkIcon, loader, tick } from "../assets";
import { useLazyGetSummaryQuery } from "../services/article";


Modal.setAppElement("#root");

const Demo = () => {
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });

  let subTitle;

  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [linkToRemove, setLinkToRemove] = useState("");

  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem("articles")
    );

    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data } = await getSummary({ articleUrl: article.url });

    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };

      const updateAllArticles = [newArticle, ...allArticles];

      setArticle(newArticle);
      setAllArticles(updateAllArticles);

      localStorage.setItem("articles", JSON.stringify(updateAllArticles));
    }
  };
  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(false), 3000);
  };

  function openModal(url) {
    setLinkToRemove(url);
    setIsOpen(true);
  }

  function afterOpenModal() {
    subTitle.style.color = "#ffffffc6";
  }

  function closeModal() {
    setIsOpen(false);
  }

  //Tem como melhorar essa função removeLink? 
  const removeLink = (url) => {
    const newArticles = allArticles.filter((item) => item.url !== url);
    setAllArticles(newArticles);
    localStorage.setItem("articles", JSON.stringify(newArticles));
    closeModal();
  };
  


  return (
    <section className="mt-16 w-full max-w-xl">
      <div className="flex flex-col w-full gap-2">
        <form
          className="relative flex justify-center items-center"
          onSubmit={handleSubmit}
        >
          <img
            src={linkIcon}
            alt="link_icon"
            className="absolute left-0 my-2 ml-3 w-5"
          />
          <input
            type="url"
            placeholder="Enter a URL"
            value={article.url}
            onChange={(e) => setArticle({ ...article, url: e.target.value })}
            required
            className="url_input peer"
          />

          <button
            type="submit"
            className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-400"
          >
            ↵
          </button>
        </form>

        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {allArticles.map((item, index) => (
            <div
              key={`link-${index}`}
              onClick={() => setArticle(item)}
              className="link_card"
            >
              <div className="copy_btn hover:bg-gray-400" onClick={() => handleCopy(item.url)} >
                <img
                  src={copied === item.url ? tick : copy}
                  alt="copy_icon"
                  className="w-[40%] h-[40%] object-contain"
                />
              </div>
              <p className="flex-1 font-satoshi text-zinc-500 font-medium text-sm truncate">
                {item.url}
              </p>
              <button onClick={() => openModal(item.url)} className=" text-gray-400 hover:text-white">
                <MdOutlineDeleteForever size={20} />
              </button>

              <Modal
                className="z-40 absolute rounded-2xl p-4 w-80 h-1/6 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black text-white"
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                overlayClassName="fixed inset-0 bg-[#0000001d]"
              >
                <button
                  onClick={closeModal}
                  className="absolute top-0 right-2 text-white text-2xl hover:text-gray-400"
                >
                  ×
                </button>

                <div className="text-center">
                  <h2
                    className="font-inter font-medium text-zinc-300"
                    ref={(_subTitle) => (subTitle = _subTitle)}
                  >
                   Remover link ?
                  </h2>
                </div>

                <div className="flex justify-center mt-10">
                  <button
                    onClick={closeModal}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-4 w-24 h-8 rounded-md mr-4"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => removeLink(linkToRemove)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold px-2 rounded-md w-24 h-8 text-center"
                  >
                    Remover
                  </button>
                </div>
              </Modal>
            </div>
          ))}
        </div>
      </div>

      <div className="my-10 max-w-full flex justify-center items-center">
        {isFetching ? (
          <img src={loader} alt="loader" className="w-20 h-20 object-contain" />
        ) : error ? (
          <p className="font-inter font-bold text-red-500 text-sm text-center">
            Bem, isso não deveria ter acontecido... <br />
            <span className="font-satoshi font-normal text-red-500">
              {error?.data?.error}
            </span>
          </p>
        ) : (
          article.summary && (
            <div className="flex flex-col gap-3">
              <h2 className="font-satoshi font-bold text-zinc-600 text=xl">
                Article
                <span className="blue_gradient"> Summary </span>
              </h2>

              <div className="summary_box">
                <p className="font-inter font-light  text-zinc-300">
                  {article.summary}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Demo;

// ==UserScript==
// @name         Przypominacz
// @namespace    przypominacz
// @version      0.1
// @description  Przypomina tobie o wpisie na mikro
// @author       Yarakami
// @match        https://www.wykop.pl/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    var myStorage = window.localStorage;
    var currentUrl = window.location.href;

    var navBar = null;
    var ul = null
    var posts = null;

    if(currentUrl.includes("ustawienia"))
    {
        //Add new element to navbar
        navBar = document.getElementsByClassName("nav bspace rbl-block")[0];
        navBar.childNodes.forEach(element =>
        {
            if(element.childElementCount >5)
            {
                //Create span with text
                var nSpan = document.createElement("span");
                nSpan.innerHTML = "Przypominacz";

                //Create link
                var nHref = document.createElement('a');
                nHref.href = "https://www.wykop.pl/ustawienia/przypominacz/";
                nHref.appendChild(nSpan); //Append span with text to link

                //Create li element
                var nLi = document.createElement("LI");
                nLi.appendChild(nHref); //Append

                ul = element;
                ul.appendChild(nLi);
            }
        });
    }



    ///Addon settings page - Beginning
    if(currentUrl.includes("ustawienia/przypominacz/"))
    {
        //Page preparation - remove unwanted elements
        document.getElementsByClassName("rbl-block space ")[0].remove();
        var settingsForm = document.getElementsByClassName("settings")[0];
        settingsForm.innerHTML = '';

        //
        ul.childNodes.forEach(element =>
        {
            if(element.firstChild)
            {
                var child = element.firstChild;
                if(child.innerText === "Ustawienia") element.classList.remove("active");
                if(child.innerText === "Przypominacz") element.classList.add("active");
            }
        });

        var nFieldset0 = document.createElement("fieldset");
        var nHeadline0 = document.createElement("h4");
        nHeadline0.innerHTML = "Ustawienia przypominacza";

        var nDiv0 = document.createElement("div");
        nDiv0.classList.add("space");

        nFieldset0.appendChild(nHeadline0);
        nFieldset0.appendChild(nDiv0);

        var nFieldset1 = document.createElement("fieldset");
        var nHeadline1 = document.createElement("h4");
        nHeadline1.innerHTML = "Lista wpisów";

        var nDiv1 = document.createElement("div");
        nDiv1.classList.add("space");
        nDiv1.classList.add("nPosts");

        nFieldset1.appendChild(nHeadline1);
        nFieldset1.appendChild(nDiv1);

        settingsForm.appendChild(nFieldset0);
        settingsForm.appendChild(nFieldset1);
        CreatePostsList();
        setInterval(CreatePostsList, 3000);
    }
    ///Addon settings page - End

    function CreatePostsList()
    {
        var postsParent = document.getElementsByClassName("nPosts")[0];
        var postsUl = document.getElementsByClassName("nPostsData")[0];
        if(postsUl) postsUl.remove();
        var posts = GetSavedPosts();
        if(posts.length ==0)
        {
            var info0 = document.createElement("div");
            info0.classList.add("nPostsData");
            var infoParagraph0 = document.createElement("p");
            infoParagraph0.innerHTML = "Brak zapisanych wpisów ( ͡° ʖ̯ ͡°)";
            info0.appendChild(infoParagraph0);
            postsParent.appendChild(info0);
        }
        else
        {
            var info1 = document.createElement("div");
            info1.classList.add("nPostsData");
            var infoParagraph1 = document.createElement("p");
            infoParagraph1.innerHTML = "Liczba zapisanych wpisów: "+posts.length+"  ᕦ(òóˇ)ᕤ";
            info1.appendChild(infoParagraph1);
            postsParent.appendChild(info1);
        }
    }

    //Add notification button function
    if(currentUrl.includes("/wpis/"))
    {
        CheckButton(GetCurrentPostId(), false);
    }


    function CheckButton(postId, buttonAction)
    {
        var activeElement = document.getElementsByClassName("vC")[0];
        var isInHistory = null;

        if(!myStorage.getItem(postId))
        {
            isInHistory = false;
            if(buttonAction)
            {
                 myStorage.setItem(postId , "asd");
                isInHistory = true;
            }

        }else
        {
            isInHistory = true;
            if(buttonAction)
            {
                myStorage.removeItem(postId);
                isInHistory = false;
            }
        }

        var nI = null;
        var nA = null;

        if(!isInHistory)
        {
            nI = document.createElement("i");
            nI.classList.add("fa-bell");
            nA = document.createElement("a");
            nA.classList.add("button");
            nA.classList.add("mikro");
            nA.classList.add("nprzypominacz");
            nA.appendChild(nI);
            nA.addEventListener("click", OnClick);
            activeElement.lastChild.remove();
            activeElement.appendChild(nA);
        }
        else
        {
            nI = document.createElement("i");
            nI.classList.add("fa-bell-o");
            nA = document.createElement("a");
            nA.classList.add("button");
            nA.classList.add("mikro");
            nA.classList.add("nprzypominacz");
            nA.appendChild(nI);
            nA.addEventListener("click", OnClick);
            activeElement.lastChild.remove();
            activeElement.appendChild(nA);
        }
    }


    function OnClick()
    {
        var asd = GetCurrentPostId();
        CheckButton(GetCurrentPostId(), true);
    };


    function GetCurrentPostId()
    {
        var pth = window.location.pathname.replace('/wpis/','');
        var n = pth.indexOf('/');
        return pth.substring(0, n != -1 ? n : pth.length);;
    }

    function GetSavedPosts()
    {
        var savedPosts = [];
        for (var key in myStorage){
            if(!isNaN(key))
            {
                var sp =
                {
                    id: key,
                    date: myStorage.getItem(key)
                }
                savedPosts.push(sp);
            }
        }
        return savedPosts;
    }


})();

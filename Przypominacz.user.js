// ==UserScript==
// @name         Przypominacz
// @namespace    przypominacz
// @version      0.3
// @description  Przypomina tobie o wpisie na mikro
// @author       Yarakami
// @match        https://www.wykop.pl/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.26.0/moment.min.js
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    let myStorage = window.localStorage;
    let currentUrl = window.location.href;

    let navBar = null;
    let ul = null
    let posts = null;

    let nav = document.getElementsByClassName("m-hide")[0];

    let nI = document.createElement("i");
    nI.classList.add("fa");
    nI.classList.add("fa-info-circle");

    let nLink = document.createElement("a");
    nLink.classList.add("dropdown-show");
    CreateCounter();
    setInterval(CreateCounter, 3000);



    nLink.href = "";
    nLink.appendChild(nI);



    let nLi = document.createElement("li");
    nLi.addEventListener("click", Redirect);
    nLi.appendChild(nLink);
    nLi.classList.add("notification");
    nav.parentNode.insertBefore(nLi, nav.nextSibling);

    function CreateCounter()
    {
        let postsCount = GetSavedPosts();
        let notificationsCount = GetNotifications(postsCount);
        if(notificationsCount >0)
        {
            let counter = document.getElementsByClassName("counter")[0];
            if(counter)
            {
                counter.innerHTML = notificationsCount;
            }
            else
            {
                let nB = document.createElement("b");
                nB.classList.add("counter");
                nB.innerHTML = notificationsCount;
                nLink.appendChild(nB);
            }
        }
        else
        {
            let counter = document.getElementsByClassName("counter")[0];
            if(counter) counter.remove();
        }
    }

    function GetNotifications(array)
    {
        let count = 0;
        let date = moment();
        array.forEach(element => {
            if(IsOldDate(element.date))count ++;
        })

        return count;
    }

    function Redirect()
    {
        window.location.href = "https://www.wykop.pl/ustawienia/przypominacz/";
    }

    if(currentUrl.includes("ustawienia"))
    {
        //Add new element to navbar
        navBar = document.getElementsByClassName("nav bspace rbl-block")[0];
        navBar.childNodes.forEach(element =>
        {
            if(element.childElementCount >5)
            {
                //Create span with text
                let nSpan = document.createElement("span");
                nSpan.innerHTML = "Przypominacz";

                //Create link
                let nHref = document.createElement('a');
                nHref.href = "https://www.wykop.pl/ustawienia/przypominacz/";
                nHref.appendChild(nSpan); //Append span with text to link

                //Create li element
                let nLi = document.createElement("LI");
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
        let settingsForm = document.getElementsByClassName("settings")[0];
        settingsForm.innerHTML = '';

        //
        ul.childNodes.forEach(element =>
        {
            if(element.firstChild)
            {
                let child = element.firstChild;
                if(child.innerText === "Ustawienia") element.classList.remove("active");
                if(child.innerText === "Przypominacz") element.classList.add("active");
            }
        });

        let nFieldset0 = document.createElement("fieldset");
        let nHeadline0 = document.createElement("h4");
        nHeadline0.innerHTML = "Ustawienia przypominacza";

        let nForm0 = document.createElement("form");
        nForm0.classList.add("width-two-third");

        let nForm0Label = document.createElement("label");
        nForm0Label.innerHTML = "Czas przypomnienia (Minuty)";
        let nForm0Input = document.createElement("input");
        nForm0Input.type = "text";
        nForm0Input.classList.add("interval");
        let intTime = myStorage.getItem("interval");
        if(intTime) nForm0Input.value = intTime;
        nForm0.appendChild(nForm0Label);
        nForm0.appendChild(nForm0Input);

        let nFieldset = document.createElement("fieldset");
        nFieldset.classList.add("row");
        nFieldset.classList.add("button");
        nFieldset.setAttribute("style", "background: transparent; border: transparent;");

        let nFieldsetButton = document.createElement("button");
        //nFieldsetButton.classList.add("submit");
        nFieldsetButton.innerHTML = "Zapisz";
        nFieldsetButton.addEventListener("click", ChangeInterval);
        nFieldset.appendChild(nFieldsetButton);

        nFieldset0.appendChild(nHeadline0);
        nFieldset0.appendChild(nForm0);
        nFieldset0.appendChild(nFieldset);

        let nFieldset1 = document.createElement("fieldset");
        let nHeadline1 = document.createElement("h4");
        nHeadline1.innerHTML = "Lista wpisów";

        let nDiv1 = document.createElement("div");
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
        let postsParent = document.getElementsByClassName("nPosts")[0];
        let postsUl = document.getElementsByClassName("nPostsData")[0];
        if(postsUl) postsUl.remove();
        let posts = GetSavedPosts();
        if(posts.length ==0)
        {
            let info0 = document.createElement("div");
            info0.classList.add("nPostsData");
            let infoParagraph0 = document.createElement("p");
            infoParagraph0.innerHTML = "Brak zapisanych wpisów ( ͡° ʖ̯ ͡°)";
            info0.appendChild(infoParagraph0);
            postsParent.appendChild(info0);
        }
        else
        {
            let info1 = document.createElement("div");
            info1.classList.add("nPostsData");
            let infoUl = document.createElement("ul");
            posts.forEach(element => {
                let infoLi = document.createElement("ul");
                let infoA = document.createElement("p");
                let deleteButton = '<a class="remove-item" id="'+element.id+'" ><i class="fa fa-times" style="margin-left:24px"></i><a>';
                infoA.innerHTML = '<a href ="https://www.wykop.pl/wpis/'+element.id+'/"><i style="padding-top:10px" class="fa fa-external-link"></i>Link</a> || ' + moment(element.date).format('DD/MM/YYYY, H:mm:ss') + "" + deleteButton;
                infoLi.appendChild(infoA);

                infoUl.appendChild(infoLi);
            })
            info1.appendChild(infoUl);
            postsParent.appendChild(info1);
            let btnList = document.getElementsByClassName("remove-item");
            btnList = [].slice.call(btnList);

            if(btnList.length >0)
            {
                btnList.forEach(element => {
                    console.log(element);
                    element.addEventListener("click", function(){
                        RemovePost(element.id);
                    }, false);
                })
            }
        }
    }
    //Add notification button function
    if(currentUrl.includes("/wpis/"))
    {
        CheckButton(GetCurrentPostId(), false);
    }

    function RemovePost(id)
    {
        myStorage.removeItem(id);
        CreatePostsList();
        CreateCounter();
    }


    function CheckButton(postId, buttonAction)
    {
        let activeElement = document.getElementsByClassName("vC")[0];
        let isInHistory = null;

        if(!myStorage.getItem(postId))
        {
            isInHistory = false;
            if(buttonAction)
            {
                let date = moment();

                console.log(moment(date).toISOString());
                let inter = myStorage.getItem("interval");
                let timeToAdd = null;
                if(inter) timeToAdd = inter;
                else inter = 15;

                let added = moment(date).add(inter, 'minutes').toISOString();
                console.log(added);
                myStorage.setItem(postId , added);
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

        let nI = null;
        let nA = null;

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

    function IsOldDate(dateToCheck)
    {
        let dateNow = moment();
        dateToCheck = moment(dateToCheck);
        if(dateNow>= dateToCheck) return true;
        else return false;
    }


    function OnClick()
    {
        CheckButton(GetCurrentPostId(), true);
    };


    function GetCurrentPostId()
    {
        let pth = window.location.pathname.replace('/wpis/','');
        let n = pth.indexOf('/');
        return pth.substring(0, n != -1 ? n : pth.length);;
    }

    function GetSavedPosts()
    {
        let savedPosts = [];
        for (let key in myStorage){
            if(!isNaN(key) && key)
            {
                let sp =
                {
                    id: key,
                    date: myStorage.getItem(key)
                }
                savedPosts.push(sp);
            }
        }
        return savedPosts;
    }

    function ChangeInterval()
    {
        let intervalInput = document.getElementsByClassName("interval")[0];
        if(intervalInput)
        {
            if(isNaN(intervalInput.value))
            {
                alert("Podaj poprawną liczbę");
            }
            else
            {
                let l = Math.round(intervalInput.value);
                if(l <5)alert("Liczba jest za mała");
                else if(l >60)alert("Liczba jest za duża");
                else
                {
                    myStorage.setItem("interval" , l);
                }
            }
            //
        }
    }


})();

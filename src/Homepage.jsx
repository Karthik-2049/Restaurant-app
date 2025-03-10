import React, { useEffect, useState } from 'react'
import './css/homepage.css'
import { paginate } from './utils/paginate'
import Pagination from './Pagination'

import { searchfilter } from './utils/searchfilter'
import { NavLink } from 'react-router-dom'



function Homepage() {


    const [list_rest, setRest] = useState([])
    const [pgnum, setPgnum] = useState(1)
    const [pgsize, setPgsize] = useState(8);
    const [pgchange, setPgchange] = useState(1)
    const [search, setSearch] = useState("")
    const [thumb, setThumb] = useState([])
    const [dark, setDark] = useState(true)
    



    let searched = list_rest
    if(search!=="")
        searched = searchfilter(list_rest,search);
    const new_List = paginate(searched,pgnum,pgsize)




    useEffect(() => {
        fetch('/restaurants')
          .then(response => response.json())
          .then(data => {
            setRest(data)
            console.log("Restaurants list is stored")
            // console.log(data); 
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });

          fetch('/thumbnails')
          .then(response => response.json())
          .then(data => {
            setThumb(data)
            // console.log(data)
            console.log("Thumbnails list is stored")
            // console.log(data); 
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });

      }, []);
    

    const onPageChange = (pgnumber, tochange) =>
    {
        setPgnum(pgnumber)
        if(tochange)
        {
            setPgchange(pgnumber)
        }
    }

    const findRest = (regId) =>
    {
        console.log("Find rest executed")
        if(thumb.length!==0)
        {
            const result = thumb.find(obj => obj["Restaurant ID"] === regId);
            console.log(result)
            return result['thumb']
        }
        return ""
    }

    const handleSearch = (e) => {
        const input = e.currentTarget.value;
        // console.log("Called : ", input);
        setSearch(input)
        setPgnum(1)
        setPgchange(1)
        console.log(search)
        
      };
    const handleDark =() =>
    {
        setDark(!dark)
    }

    // #b0b7bb
      
  return (
    <div style={dark? {"backgroundColor":"#131c24",'color':'white' } : {"backgroundColor":"#b0b7bb", 'color':'#131c24'}}  className="hom">
        <header>
            <p>
                Dine Well
            </p>
            <div onClick={()=>handleDark()} className="icon">
            <i  class={dark ? "fa-solid fa-moon": "fa-regular fa-moon"}></i>
            </div>
        </header>
        <div className="x">
            <h1>Restaurants</h1>
            <div className={dark ? "flex px-4 py-3 rounded-md border-2 overflow-hidden max-w-md font-[sans-serif]":"flex px-4 py-3 rounded-md border-2 border-black overflow-hidden max-w-md font-[sans-serif]"}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192.904 192.904" width="16px"
            className="fill-gray-600 mr-3 rotate-90">
            <path
                d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z">
            </path>
            </svg>
            <input type="text" onChange={handleSearch} placeholder="Search Restaurants..." className={dark? "w-full outline-none bg-transparent text-white-600 text-sm":"w-full outline-none bg-transparent text-black text-sm"} />
            </div>

            <div className="filter_buttons">
                <div className="elem">
                    Country
                </div>
                <div className="elem">
                Average Spend for Two People
                </div>
                <div className="elem">
                Cuisines
                </div>
            </div>

            <div className="all_restaurants">
                {new_List.map(elem => (
                    <NavLink to = {`/${elem["Restaurant ID"]}`}  >
                        <div className="restlist" key={elem["Restaurant ID"]}>
                        <img src={findRest(elem["Restaurant ID"])} className="immg"></img>
                        <div className="all">
                            <h2>{elem["Restaurant Name"]}</h2>
                            <div className="starsreviews">
                                {elem["Aggregate rating"]} <i class="fas fa-star"></i>&nbsp;&nbsp; {elem["Votes"]}+ votes
                            </div>
                        </div>
                    </div>
                    </NavLink>
                ))}
            </div>

        </div>
        <div className="pagge">
           <Pagination pgnum = {pgchange} onPageChange ={onPageChange} currpg = {pgnum} pgsize = {pgsize} Size = {searched.length} dark = {dark}/>
           </div>
    </div>
  )
}

export default Homepage
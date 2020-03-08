import React from 'react';
import './Restaurants.css';
import BibXMaitres from './maitresbib'
import {geolocated} from 'react-geolocated';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faSearchLocation, faMapMarker, faPhoneAlt } from '@fortawesome/free-solid-svg-icons'



class Restaurant extends React.Component {

  state= {
    search: "",
    sort: 'all',
    order : 'asc',
    count : 0
  }

    BibXMaitresDisplay(){
      if(this.state.order === 'desc'){
          return BibXMaitres.sort((a,b) => b.name.localeCompare(a.name))
      }
      return BibXMaitres.sort((a,b) => a.name.localeCompare(b.name))
    }

   distance(lat1, lon1, lat2, lon2) {
    if ((lat1 === lat2) && (lon1 === lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1/180;
      var radlat2 = Math.PI * lat2/180;
      var theta = lon1-lon2;
      var radtheta = Math.PI * theta/180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515;
      dist = dist * 1.609344
      return dist;
    }
  }

  renderRestaurants = restaurant =>{
    const {search,sort} = this.state

    if(search !== "" && restaurant.name.toLowerCase().indexOf(search.toLowerCase()) === -1){
      return null
    }

    if(sort !== 'all')
    {
      if(this.props.coords != null){
        const { latitude, longitude } = this.props.coords;
        let dist = this.distance(latitude,longitude,restaurant.position.lat,restaurant.position.lon);
        if (dist > parseInt(sort))
        {
          return null
        }
      }     

    }
    
      return <div class="restaurant-container">
      <button class="card" onClick={() => window.open(restaurant.url, "_blank")}>
        <p class='name'>{restaurant.name}</p>
        
        <div class='address'>
        <FontAwesomeIcon icon={faMapMarker} id="mapMarker"/>
         {restaurant.address} </div>
        <div class='tel'>
          <FontAwesomeIcon icon={faPhoneAlt} id="phone"/>
          {restaurant.tel}</div>
      </button>
    </div>

  }
  

  searchName = e => {
    this.setState({search : e.target.value})
  }

  getDistance = e => {
    this.setState({sort: e.target.value})
  }

  choseOrder = e => {
    this.setState({order: e.target.value})
  }



    render() {
        return <div class="container">
           <div class="search"> 
              <FontAwesomeIcon icon={faSearchLocation} id="searchIcon"/>
              <input id="searchBox" label="Search a Restaurant" onChange={this.searchName}
                placeholder= "Search a Restaurant"
              />   

              <form class="distList">
                <label>
                  Maximum distance between you and your meal : <br/>
                  <select id="values" value={this.state.sort} onChange={this.getDistance}>
                    <option value="all">All France</option>
                    <option value="20">20 km</option>
                    <option value="40">40 km</option>
                    <option value="60">60 km</option>
                    <option value="100">100 km</option>
                  </select>
                </label>
              </form>

            </div>

          <form class="order" onChange={this.choseOrder}>
            Order the list by :
            <div class="radioButton">
              <label>
                <input type="radio" value="asc" checked={this.state.order === 'asc'}/>ASC
              </label>
            </div>
            <div class="radioButton">
              <label>
                <input type="radio" value="desc" checked={this.state.order === 'desc'}/>DESC
              </label>
            </div>
          </form>
          <div class="styleLine"></div>
          <div class="restaurantList">
            

              {this.BibXMaitresDisplay().map( 
                
                restaurant => { 

                return this.renderRestaurants(restaurant) 

              })

              }

          </div>

					
				
			</div>

      
    }

}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false
  },
  userDecisionTimeout: 5000
})(Restaurant);

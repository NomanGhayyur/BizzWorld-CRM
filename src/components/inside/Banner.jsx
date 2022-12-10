
import React from 'react'
import { Icon } from 'elements'

const Banner = () => {
  return (
    <>
        <div className='nav-banner'>
            <nav className="navbar navbar-expand-lg bg-light">
                <div className="container-fluid">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="#">Analytics</a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link" href="#">Crypto</a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link disabled">Campaign</a>
                    </li>
                    <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            More
          </a>
          <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
            <li><a className="dropdown-item" href="#">Number of Clients</a></li>
            <li><a className="dropdown-item" href="#">Sales</a></li>
            <li><hr className="dropdown-divider"></hr></li>
            <li><a className="dropdown-item" href="#">Performance</a></li>
          </ul>
        </li>
                    
                </ul>
                <form className="d-flex" role="search">
                    <button className="btn border m-2" type="submit">ToDO</button>
                    <button className="btn border m-2" type="submit">Setting</button>
                </form>
                </div>
                </div>
            </nav>
        </div>
        <div className='income-banner container d-flex '>
            <div className="income-ban-card col-lg-3">
                <p>Total Income</p>
                <h2><strong>$ 8025</strong></h2>
                <p>3.78 <span> <Icon className='m-1' name="caret-up-fill"/> </span> This month</p>
            </div>
            <div className="col-lg-3 income-ban-card">
                <p>Sessions</p>
                <h2><strong>8025</strong></h2>
                <p>3.78 <span> <Icon className='m-1' name="caret-up-fill"/> </span> This month</p>
            </div>
            <div className="col-lg-3 income-ban-card">
                <p>Ethereum Wallet</p>
                <h2><strong>8025</strong></h2>
                <p>3.78 <span> <Icon className='m-1' name="caret-up-fill"/> </span> This month</p>
            </div>
            <div className="col-lg-3 income-ban-card">
                <p>Number of Clients</p>
                <h2><strong>8025</strong></h2>
                <p>3.78 <span> <Icon className='m-1' name="caret-up-fill"/> </span> This month</p>
                
            </div>
        </div>
    </>
  )
}

export default Banner
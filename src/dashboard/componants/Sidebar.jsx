import React, { useEffect, useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { FaHome, FaBox, FaList, FaUser, FaCog, FaChartBar, FaSignOutAlt, FaClipboardList ,FaBars} from "react-icons/fa";
import { Link } from "react-router-dom";
const Sidebarcomp = () => {


  const [collapsed, setCollapsed] = useState(false);

  const handleToggle = () => {
    setCollapsed(!collapsed);
  };

  return (
      <div>
          
        <Sidebar className="sidebar" collapsed={collapsed}>
        
        <Menu>
            <MenuItem className="Welcome" icon={<FaBars />} onClick={handleToggle}>
              {collapsed ? "" : "Welcome Admin"}
            </MenuItem>
                              
            {/* Home */}
            <MenuItem icon={<FaHome />}>Home</MenuItem>

            {/* Orders */}
            <MenuItem icon={<FaClipboardList />}  component={<Link to="/main_dashboard/dashboard_Orders" />}>Orders</MenuItem>

            {/* Products */}
            <MenuItem icon={<FaBox />} component={<Link to="/main_dashboard/products" />}>Products</MenuItem>

            {/* Categories */}
            <MenuItem icon={<FaList />} component={<Link to="/main_dashboard/categories" />}  >Categories</MenuItem>

            {/* Sup Categories */}
            <MenuItem icon={<FaUser />} component={<Link to="/main_dashboard/supcategory" />} >Sup Categories</MenuItem>

            {/* blogs */}
            <MenuItem icon={<FaUser />} component={<Link to="/Main_dashboard/blogs" />}   >Blogs</MenuItem>
            
            {/* Users */}
            <MenuItem icon={<FaUser />} component={<Link to="/main_dashboard/users" />}   >Users</MenuItem>
            
            {/* Analytics */}
            <MenuItem icon={<FaChartBar />} component={<Link to="/main_dashboard/offers" />} >Offers</MenuItem>

            {/* Settings */}
            <SubMenu label="Settings" icon={<FaCog />}>
              <MenuItem>General</MenuItem>
              <MenuItem>Account</MenuItem>
            </SubMenu>

            {/* Logout */}
            <MenuItem icon={<FaSignOutAlt />}>Logout</MenuItem>

          </Menu>
        </Sidebar>

    </div>
  )
}

export default Sidebarcomp


import React from 'react'
import { Nav, Tab } from 'react-bootstrap'
import { NavLink, useLocation } from 'react-router-dom'
import "./DashTabs.scss"

declare type HeaderProps = {
    tabName: string,
    path: string,
    filter?: string,
    count?: number
}

declare type DashTabsProps = {
    isRouteTabs?: boolean,
    onSelectTabs?: (e: any) => void,
    tabGroupName?: string,
    headers: HeaderProps[],
    contents?: JSX.Element[] | string[],
    tabValue?:number;
}

const DashTabs: React.FC<DashTabsProps> = ({ isRouteTabs, tabGroupName, headers, onSelectTabs, tabValue}) => {
    const { search } = useLocation();
    if (isRouteTabs) {
        return (
            // <Tab.Container id={`dash-tab-container-${tabGroupName}`} defaultActiveKey={`${tabGroupName}-0`}>
            <div className="dash-tabs-header dash-box-shadow d-flex align-items-end justify-content-center w-100 mb-4">
                <Nav variant="pills" className="h-100 w-100 flex-row d-flex align-items-center justify-content-lg-around fw-bold text-center">
                    {headers && headers.map((header: HeaderProps, index: number) => (
                        <Nav.Item className='tabs-header-box' key={`${tabGroupName}-${index}`} >
                            <NavLink className="nav-pills nav-link" to={`${header.path}` + search}>
                                {header.tabName}
                            </NavLink>
                        </Nav.Item>
                    ))}
                </Nav>
            </div>

            // </Tab.Container >
        )
    } else {
        return (
            <Tab.Container id={`dash-tab-container`} activeKey={`${tabGroupName}-${tabValue}`} onSelect={onSelectTabs}>
                <div className="dash-tabs-header dash-box-shadow d-flex align-items-end justify-content-center w-100 mt-2">
                    <Nav variant="pills" className="h-100 w-100 flex-row d-flex align-items-center justify-content-lg-around fw-bold text-center">
                        {headers?.map((header: HeaderProps, index: number) => (
                            <Nav.Item className='tabs-header-box' key={`${tabGroupName}-${index}`} >
                                <Nav.Link eventKey={`${tabGroupName}-${index}`} >{header.tabName} ({header.count!})</Nav.Link>
                            </Nav.Item>
                        ))}
                    </Nav>
                </div>
            </Tab.Container >
        )
    }

}

DashTabs.defaultProps = {
    isRouteTabs: false,
    tabGroupName: 'default',
    headers: [{ tabName: "Tab 1", path: "tab1" }, { tabName: "Tab 2", path: "tab2" }, { tabName: "Tab 3", path: "tab3" }],
    contents: ["Tab 1 Conent", "Tab 2 content", "Tab 3 conent"],
}

export default DashTabs
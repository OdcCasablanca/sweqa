import React, { useState, useEffect } from 'react';
import {
    Drawer,
    List,
    ListItemIcon,
    ListItemText,
    IconButton,
    Box,
    useTheme,
    useMediaQuery,
    Divider,
    Typography,
    Collapse,
    ListItemButton,
    Avatar,
    Menu,
    MenuItem,
    Button
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    Category as CategoryIcon,
    Inventory as InventoryIcon,
    Settings as SettingsIcon,
    ShoppingCart as OrdersIcon,
    Store as StoreIcon,
    Add as AddIcon,
    ExpandLess,
    ExpandMore,
    ViewList as ViewListIcon,
    LocalOffer as TagIcon,
    Palette as ThemeIcon,
    Language as DomainIcon,
    Description as ContentIcon,
    KeyboardArrowDown as ArrowDownIcon
} from '@mui/icons-material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DRAWER_WIDTH = 280;

const StoreSidebar = ({ storeId, storeName, storeLogo }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [productsOpen, setProductsOpen] = useState(true);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [stores, setStores] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        try {
            const response = await axios.get('http://localhost:5005/api/stores/my-stores');
            setStores(response.data);
        } catch (error) {
            console.error('Failed to fetch stores:', error);
        }
    };

    const handleStoreMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleStoreMenuClose = () => {
        setAnchorEl(null);
    };

    const handleStoreChange = (storeId) => {
        navigate(`/store-admin/${storeId}`);
        handleStoreMenuClose();
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleProductsClick = () => {
        setProductsOpen(!productsOpen);
    };

    const handleSettingsClick = () => {
        setSettingsOpen(!settingsOpen);
    };

    const menuItems = [
        {
            text: 'Dashboard',
            icon: <DashboardIcon sx={{ color: '#FF6B00' }} />,
            path: `/store-admin/${storeId}`
        },
        {
            text: 'Orders',
            icon: <OrdersIcon sx={{ color: '#FF6B00' }} />,
            path: `/store-admin/${storeId}/orders`
        },
        {
            text: 'Products',
            icon: <InventoryIcon sx={{ color: '#FF6B00' }} />,
            subitems: [
                {
                    text: 'All Products',
                    icon: <ViewListIcon sx={{ color: '#FF6B00' }} />,
                    path: `/store-admin/${storeId}/products`
                },
                {
                    text: 'Add Product',
                    icon: <AddIcon sx={{ color: '#FF6B00' }} />,
                    path: `/store-admin/${storeId}/create-product`
                },
                {
                    text: 'Categories',
                    icon: <CategoryIcon sx={{ color: '#FF6B00' }} />,
                    path: `/store-admin/${storeId}/categories`
                }
                // Removed Tags
            ]
        },
        {
            text: 'Store Settings',
            icon: <SettingsIcon sx={{ color: '#FF6B00' }} />,
            subitems: [
                {
                    text: 'General',
                    icon: <StoreIcon sx={{ color: '#FF6B00' }} />,
                    path: `/store-admin/${storeId}/settings`
                },
                {
                    text: 'Theme',
                    icon: <ThemeIcon sx={{ color: '#FF6B00' }} />,
                    path: `/store-admin/${storeId}/theme`
                },
                {
                    text: 'Domain',
                    icon: <DomainIcon sx={{ color: '#FF6B00' }} />,
                    path: `/store-admin/${storeId}/domain`
                },
                {
                    text: 'Content',
                    icon: <ContentIcon sx={{ color: '#FF6B00' }} />,
                    path: `/store-admin/${storeId}/content`
                }
                // Removed Pages, Bannières
            ]
        }
    ];

    const drawer = (
        <Box sx={{ 
            height: '100%', 
            bgcolor: '#000000', 
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            borderRight: '3px solid #FF6B00',
        }}>
            <Box sx={{ 
                p: 2, 
                borderBottom: '1px solid #333',
                background: 'linear-gradient(180deg, rgba(255,107,0,0.1) 0%, rgba(0,0,0,0) 100%)'
            }}>
                <Button
                    onClick={handleStoreMenuClick}
                    sx={{
                        width: '100%',
                        justifyContent: 'flex-start',
                        color: '#FF6B00',
                        fontWeight: 'bold',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 107, 0, 0.1)',
                        }
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Avatar
                            src={storeLogo}
                            sx={{
                                width: 40,
                                height: 40,
                                mr: 1,
                                bgcolor: '#FF6B00',
                                border: '2px solid #FF6B00'
                            }}
                        >
                            <StoreIcon />
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle1" sx={{ color: '#FF6B00', fontWeight: 'bold' }}>
                                {storeName || 'Store Admin'}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#999' }}>
                                Switch Store
                            </Typography>
                        </Box>
                        <ArrowDownIcon sx={{ color: '#FF6B00' }} />
                    </Box>
                </Button>
            </Box>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleStoreMenuClose}
                PaperProps={{
                    sx: {
                        bgcolor: '#000000',
                        color: '#FFFFFF',
                        border: '1px solid #333',
                        minWidth: 250
                    }
                }}
            >
                {stores.map((store) => (
                    <MenuItem 
                        key={store._id}
                        onClick={() => handleStoreChange(store._id)}
                        sx={{
                            '&:hover': {
                                bgcolor: 'rgba(255, 107, 0, 0.1)',
                            }
                        }}
                    >
                        <Avatar
                            src={store.logo}
                            sx={{
                                width: 30,
                                height: 30,
                                mr: 1,
                                bgcolor: store._id === storeId ? '#FF6B00' : '#333'
                            }}
                        >
                            <StoreIcon />
                        </Avatar>
                        <Typography
                            sx={{
                                color: store._id === storeId ? '#FF6B00' : '#FFFFFF'
                            }}
                        >
                            {store.name}
                        </Typography>
                    </MenuItem>
                ))}
                <Divider sx={{ bgcolor: '#333' }} />
                <MenuItem 
                    component={RouterLink} 
                    to="/create-store"
                    sx={{
                        color: '#FF6B00',
                        '&:hover': {
                            bgcolor: 'rgba(255, 107, 0, 0.1)',
                        }
                    }}
                >
                    <AddIcon sx={{ mr: 1 }} />
                    Create New Store
                </MenuItem>
            </Menu>
            
            <Divider sx={{ bgcolor: '#333' }} />
            <List sx={{ flexGrow: 1, pt: 0 }}>
                {menuItems.map((item) => (
                    <React.Fragment key={item.text}>
                        {item.subitems ? (
                            <>
                                <ListItemButton
                                    onClick={item.text === 'Products' ? handleProductsClick : handleSettingsClick}
                                    sx={{
                                        py: 1.5,
                                        '&:hover': {
                                            bgcolor: 'rgba(255, 107, 0, 0.1)',
                                        },
                                    }}
                                >
                                    <ListItemIcon sx={{ color: '#FF6B00', minWidth: 40 }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary={item.text}
                                        primaryTypographyProps={{
                                            fontSize: '0.95rem',
                                            fontWeight: 500
                                        }}
                                    />
                                    {(item.text === 'Products' ? productsOpen : settingsOpen) ? 
                                        <ExpandLess sx={{ color: '#FF6B00' }} /> : 
                                        <ExpandMore sx={{ color: '#FF6B00' }} />}
                                </ListItemButton>
                                <Collapse 
                                    in={item.text === 'Products' ? productsOpen : settingsOpen} 
                                    timeout="auto" 
                                    unmountOnExit
                                >
                                    <List component="div" disablePadding>
                                        {item.subitems.map((subitem) => (
                                            <ListItemButton
                                                key={subitem.text}
                                                component={RouterLink}
                                                to={subitem.path}
                                                selected={location.pathname === subitem.path}
                                                sx={{
                                                    pl: 4,
                                                    py: 1,
                                                    '&.Mui-selected': {
                                                        bgcolor: 'rgba(255, 107, 0, 0.1)',
                                                        borderRight: '3px solid #FF6B00',
                                                        '&:hover': {
                                                            bgcolor: 'rgba(255, 107, 0, 0.2)',
                                                        },
                                                    },
                                                    '&:hover': {
                                                        bgcolor: 'rgba(255, 107, 0, 0.1)',
                                                    },
                                                }}
                                            >
                                                <ListItemIcon sx={{ color: '#FF6B00', minWidth: 40 }}>
                                                    {subitem.icon}
                                                </ListItemIcon>
                                                <ListItemText 
                                                    primary={subitem.text}
                                                    primaryTypographyProps={{
                                                        fontSize: '0.9rem'
                                                    }}
                                                />
                                            </ListItemButton>
                                        ))}
                                    </List>
                                </Collapse>
                            </>
                        ) : (
                            <ListItemButton
                                component={RouterLink}
                                to={item.path}
                                selected={location.pathname === item.path}
                                sx={{
                                    py: 1.5,
                                    '&.Mui-selected': {
                                        bgcolor: 'rgba(255, 107, 0, 0.1)',
                                        borderRight: '3px solid #FF6B00',
                                        '&:hover': {
                                            bgcolor: 'rgba(255, 107, 0, 0.2)',
                                        },
                                    },
                                    '&:hover': {
                                        bgcolor: 'rgba(255, 107, 0, 0.1)',
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ color: '#FF6B00', minWidth: 40 }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText 
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontSize: '0.95rem',
                                        fontWeight: 500
                                    }}
                                />
                            </ListItemButton>
                        )}
                    </React.Fragment>
                ))}
            </List>
            <Box sx={{ p: 2, borderTop: '1px solid #333' }}>
                <Typography variant="caption" sx={{ color: '#666' }}>
                    © 2024 StoreBuilder
                </Typography>
            </Box>
        </Box>
    );

    return (
        <>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{
                    mr: 2,
                    display: { sm: 'none' },
                    position: 'fixed',
                    top: '1rem',
                    left: '1rem',
                    zIndex: 1100,
                    bgcolor: '#FF6B00',
                    color: '#FFFFFF',
                    '&:hover': {
                        bgcolor: '#CC5500',
                    },
                }}
            >
                <MenuIcon />
            </IconButton>
            <Box
                component="nav"
                sx={{
                    width: { sm: DRAWER_WIDTH },
                    flexShrink: { sm: 0 }
                }}
            >
                {/* Mobile drawer */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: DRAWER_WIDTH,
                            bgcolor: '#000000',
                            borderRight: '1px solid #333'
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                {/* Desktop drawer */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: DRAWER_WIDTH,
                            bgcolor: '#000000',
                            borderRight: '1px solid #333'
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
        </>
    );
};

export default StoreSidebar; 
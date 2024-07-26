import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AddIcon from '@mui/icons-material/Add'
import { mainListItems, secondaryListItems, tertiaryListItems } from './listItems';
import { Button, Chip, Menu, MenuItem, Popover, Stack, TextField } from '@mui/material';
import NoteList from './NoteList';
import CreateNoteModal from './CreateNoteModal';

const drawerWidth = 240;

const defaultTheme = createTheme();

export default function Dashboard({ MainArea }) {
  const [open, setOpen] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [searchText, setSearchText] = React.useState('');
  const [noteModalOpen, setNoteModalOpen] = React.useState(false);

  const handleCreateNote = () => {

  }

  const handleSearchClick = (event) => {
    setAnchorEl(event.currentTarget);
    console.log(event.currentTarget)
  };


  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
    setAnchorEl(null);  // Hide popover when typing starts
  };

  const handleFilterSelect = (filter) => {
    console.log(`Search based on filter: ${filter}`);
    setAnchorEl(null);  // Close popover when a filter is selected
    // Perform search based on the selected filter
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCancel = () => {
    setAnchorEl(null);
  }

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const openPopover = Boolean(anchorEl);
  const id = openPopover ? 'search-popover' : undefined;

  const handleNoteModalOpen = () => setNoteModalOpen(true)
  const handleNoteModalClose = () => setNoteModalOpen(false)

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <CssBaseline />
        <IconButton
            color="primary"
            aria-label="add"
            onClick={handleNoteModalOpen}
            sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            bgcolor: 'primary.main',
            '&:hover': {
                bgcolor: 'primary.dark',
                transform: 'scale(1.1)',
                transition: 'transform 0.2s',
            },
            transition: 'transform 0.2s',
            }}
        >
            <AddIcon sx={{ color: 'white', fontSize: 30 }} />
        </IconButton>
        <AppBar
          position="absolute"
          sx={{
            zIndex: defaultTheme.zIndex.drawer + 1,
            transition: defaultTheme.transitions.create(['width', 'margin'], {
              easing: defaultTheme.transitions.easing.sharp,
              duration: defaultTheme.transitions.duration.leavingScreen,
            }),
            ...(open && {
              marginLeft: drawerWidth,
              width: `calc(100% - ${drawerWidth}px)`,
              transition: defaultTheme.transitions.create(['width', 'margin'], {
                easing: defaultTheme.transitions.easing.sharp,
                duration: defaultTheme.transitions.duration.enteringScreen,
              }),
            }),
          }}
        >
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Dashboard
            </Typography>

            <TextField
              variant="outlined"
              size="small"
              placeholder="Search..."
              value={searchText}
              onClick={handleSearchClick}
              onChange={handleSearchChange}
              sx={{ backgroundColor: 'white', borderRadius: 1 }}
            />
            
            <Popover
              id={id}
              open={openPopover}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Filter Options</Typography>
                    <Button variant="text" sx={{ color: 'red' }} onClick={handleCancel}>Cancel</Button>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="subtitle1" sx={{ color: 'blue' }}>Colors</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF', '#C0C0C0', '#808080', '#800000', '#808000'].map(color => (
                      <Box key={color} sx={{ width: 24, height: 24, backgroundColor: color, borderRadius: '50%' }}></Box>
                    ))}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="subtitle1" sx={{ color: 'blue' }}>Category</Typography>
                    <Stack direction="row" spacing={1}>
                        <Chip label="Home" onClick={handleFilterSelect}/>
                        <Chip label="Work" />
                        <Chip label="Uncategorized" />
                    </Stack>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="subtitle1" sx={{ color: 'blue' }}>Tags</Typography>
                  <Stack direction="row" spacing={1}>
                        <Chip label="#cooking" />
                    </Stack>
                </Box>
              </Box>
            </Popover>

            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          open={open}
          sx={{
            '& .MuiDrawer-paper': {
              position: 'relative',
              whiteSpace: 'nowrap',
              width: drawerWidth,
              transition: defaultTheme.transitions.create('width', {
                easing: defaultTheme.transitions.easing.sharp,
                duration: defaultTheme.transitions.duration.enteringScreen,
              }),
              boxSizing: 'border-box',
              ...(!open && {
                overflowX: 'hidden',
                transition: defaultTheme.transitions.create('width', {
                  easing: defaultTheme.transitions.easing.sharp,
                  duration: defaultTheme.transitions.duration.leavingScreen,
                }),
                width: defaultTheme.spacing(7),
                [defaultTheme.breakpoints.up('sm')]: {
                  width: defaultTheme.spacing(9),
                },
              }),
            },
          }}
        >
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems}
            <Divider sx={{ my: 1 }} />
            {secondaryListItems}
            <Divider sx={{ my: 1 }} />
            {tertiaryListItems}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <MainArea />
            <CreateNoteModal
                onSave={handleCreateNote}
                noteModalOpen={noteModalOpen}
                handleNoteModalClose={handleNoteModalClose}
            />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

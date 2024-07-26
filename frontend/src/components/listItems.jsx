import React from 'react';
import { Link } from 'react-router-dom';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import ArchiveIcon from '@mui/icons-material/Archive';
import DeleteIcon from '@mui/icons-material/Delete';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import CategoryIcon from '@mui/icons-material/Category';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export const mainListItems = (
  <React.Fragment>
    <ListItemButton component={Link} to="/all-notes">
      <ListItemIcon>
        <TextSnippetIcon />
      </ListItemIcon>
      <ListItemText primary="All notes" />
    </ListItemButton>
    <ListItemButton component={Link} to="/calendar">
      <ListItemIcon>
        <CalendarMonthIcon />
      </ListItemIcon>
      <ListItemText primary="Calendar" />
    </ListItemButton>
    <ListItemButton component={Link} to="/reminders">
      <ListItemIcon>
        <AccessAlarmIcon />
      </ListItemIcon>
      <ListItemText primary="Reminders" />
    </ListItemButton>
    <ListItemButton component={Link} to="/archive">
      <ListItemIcon>
        <ArchiveIcon />
      </ListItemIcon>
      <ListItemText primary="Archive" />
    </ListItemButton>
    <ListItemButton component={Link} to="/trash">
      <ListItemIcon>
        <DeleteIcon />
      </ListItemIcon>
      <ListItemText primary="Trash" />
    </ListItemButton>
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <ListItemButton component={Link} to="/favorites">
      <ListItemIcon>
        <StarOutlineIcon />
      </ListItemIcon>
      <ListItemText primary="Favorites" />
    </ListItemButton>
    <ListItemButton component={Link} to="/category">
      <ListItemIcon>
        <CategoryIcon />
      </ListItemIcon>
      <ListItemText primary="Category" />
    </ListItemButton>
    <ListItemButton component={Link} to="/tags">
      <ListItemIcon>
        <LocalOfferIcon />
      </ListItemIcon>
      <ListItemText primary="Tags" />
    </ListItemButton>
  </React.Fragment>
);

export const tertiaryListItems = (
  <React.Fragment>
    <ListItemButton component={Link} to="/profile">
      <ListItemIcon>
        <AccountCircleIcon />
      </ListItemIcon>
      <ListItemText primary="Profile" />
    </ListItemButton>
  </React.Fragment>
);

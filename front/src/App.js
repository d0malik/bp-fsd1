import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import { TextField, AppBar, Button, List, ListItem, ListItemSecondaryAction, ListItemText, Divider } from '@material-ui/core';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function App() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  const [data, setData] = React.useState(0);
  React.useEffect(() => {
    fetch("/all")
    .then((res) => res.json())
    .then((data) => setData(data.message));
  }, []);

  const nameChange = (event) => { setName(event.target.value); }
  const emailChange = (event) => { setEmail(event.target.value); }
  const phoneChange = (event) => { setPhone(event.target.value); }
  const addressChange = (event) => { setAddress(event.target.value); }
  
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [id, setID] = React.useState('');

  const handleEdit = (event) => {
    event.preventDefault();
    setValue(0);
    setName(event.currentTarget.dataset.name);
    setEmail(event.currentTarget.dataset.email);
    setPhone(event.currentTarget.dataset.phone);
    setAddress(event.currentTarget.dataset.address);
    setID(event.currentTarget.dataset.id);
  }
  
  const handleSave = (event) => {
    event.preventDefault();
    const data = { name, email, phone, address, id };
    
    fetch('/save', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    window.location.reload();
  }

  const handleDelete = (event) => {
    event.preventDefault();
    const data = { name, email, phone, address, id };

    fetch('/delete', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    window.location.reload();
  }

  const handleDelete2 = (event) => {
    event.preventDefault();
    const data = { id: event.currentTarget.dataset.id };

    fetch('/one', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    
    window.location.reload();
  }

  if (!data) {
    return <div />
  }else{
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs value={value} onChange={handleChange} aria-label="simple tabs example" centered>
            <Tab label="Create User" {...a11yProps(0)} />
            <Tab label="List Users" {...a11yProps(1)} />
          </Tabs>
        </AppBar>

        {/* Create User */}
        <TabPanel value={value} index={0}>
          <div style={{ width: '25%', position: 'absolute', top: '7.5%', left: '37.5%' }}>
            <form noValidate autoComplete="off">
              <TextField onChange={nameChange} id="name" value={name} label="Name" variant="filled" style={{ paddingBottom: 32 }} fullWidth />
              <TextField onChange={emailChange} id="email" value={email} label="Email" variant="filled" type="email" style={{ paddingBottom: 32 }} fullWidth />
              <TextField onChange={phoneChange} id="phone" value={phone} label="Phone Number" variant="filled" type="tel" style={{ paddingBottom: 32 }} fullWidth />
              <TextField onChange={addressChange} id="address" value={address} label="Address" variant="filled" style={{ paddingBottom: 32 }} fullWidth
                InputProps={{
                  endAdornment: (
                    <IconButton disabled>
                      <SearchIcon />
                    </IconButton>
                  )
                }}
              />
              <div style={{ display: 'flex', padding: 16 }}>
                <Button variant="contained" onClick={handleSave} color="primary" style={{ marginLeft: 'auto', right: '20%' }}>SAVE</Button>
                <Button variant="outlined" onClick={handleDelete} style={{ marginRight: 'auto', left: '20%' }}>DELETE</Button>
              </div>
            </form>
          </div>
        </TabPanel>

        {/* Edit Users */}
        <TabPanel value={value} index={1}>
          <div style={{ width: '25%', position: 'absolute', top: '7.5%', left: '37.5%' }}>
            {data.map(item => (
              <List className={classes.root}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={item.name}
                    secondary={
                      <React.Fragment>
                        {item.email} | ({item.phone.substring(0, 3)}) {item.phone.substring(3, 6)}-{item.phone.substring(6, 10)}
                        <br></br>
                        {item.address}
                      </React.Fragment>
                    }
                  />
                  <ListItemSecondaryAction>
                    <div style={{ display: 'flex' }}>
                      <Button variant="outlined" data-id={item._id} data-name={item.name} data-email={item.email} data-phone={item.phone}
                       data-address={item.address} onClick={handleEdit} aria-label="EDIT" style={{ marginLeft: 'auto', right: '15%' }}>EDIT</Button>
                      <Button variant="outlined" data-id={item._id} data-name={item.name} data-email={item.email} data-phone={item.phone}
                       data-address={item.address} onClick={handleDelete2} aria-label="DELETE" style={{ marginLeft: 'auto' }}>DELETE</Button>
                    </div>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider variant="fullWidth" component="li" />
              </List>
            ))}
          </div>
        </TabPanel>
      </div>
    );
  }
}
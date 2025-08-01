 import React from 'react';
import { Link } from 'react-router-dom';
import {
  Home as HomeIcon, Whatshot as WhatshotIcon, Subscriptions as SubscriptionsIcon,
  VideoLibrary as VideoLibraryIcon, History as HistoryIcon, WatchLater as WatchLaterIcon,
  ThumbUp as ThumbUpIcon, PlayCircle as PlayCircleIcon, VideoCameraBack as VideoCameraBackIcon,
  ContentCut as ContentCutIcon, KeyboardArrowDown as KeyboardArrowDownIcon,
} from '@mui/icons-material';

const SidebarItem = ({ icon: Icon, label, to }) => (
  <Link to={to} className="no-underline">
    <div className="flex items-center space-x-4 px-4 py-2 hover:bg-gray-200 rounded-md cursor-pointer transition duration-200">
      <Icon className="text-gray-700" />
      <span className="text-sm font-medium text-gray-800">{label}</span>
    </div>
  </Link>
);

const MAIN_ITEMS = [
  { icon: HomeIcon, label: 'Home', to: '/' },
  { icon: WhatshotIcon, label: 'Shorts', to: '/shorts' },
  { icon: SubscriptionsIcon, label: 'Subscriptions', to: '/subscriptions' },
];

const YOU_SECTION = [
  { icon: VideoCameraBackIcon, label: 'Your Channel', to: '/channel' },
  { icon: HistoryIcon, label: 'History', to: '/history' },
  { icon: PlayCircleIcon, label: 'Playlists', to: '/playlists' },
  { icon: VideoLibraryIcon, label: 'Your Videos', to: '/your-videos' },
  { icon: WatchLaterIcon, label: 'Watch Later', to: '/watch-later' },
  { icon: ThumbUpIcon, label: 'Liked Videos', to: '/liked' },
  { icon: ContentCutIcon, label: 'Your Clips', to: '/clips' },
];

const SideNavbar = ({ user }) => (
  <div className="w-80 h-full bg-white border-r p-2 space-y-3 overflow-y-auto hidden md:block">
    {MAIN_ITEMS.map((item) => (
      <SidebarItem key={item.label} {...item} />
    ))}

    <hr />
    <div className="px-4 text-xs text-gray-500 font-semibold mt-2 flex items-center justify-between">
      <span>You</span>
      <KeyboardArrowDownIcon fontSize="small" />
    </div>

    {YOU_SECTION.map((item) => (
      <SidebarItem key={item.label} {...item} />
    ))}

    <hr />
    <div className="px-4 text-xs text-gray-500 font-semibold mt-2">Subscriptions</div>

    {user ? (
      <div
        className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-200 rounded-md cursor-pointer"
      >
        <img
          src={user?.profilePic || "/default-profile.png"}
          alt="User Profile"
          className="w-8 h-8 rounded-full"
        />
        <span className="text-sm text-gray-800">{user.channelName || user.userName}</span>
      </div>
    ) : (
      <div className="px-4 text-gray-500 text-sm">No user logged in</div>
    )}
  </div>
);

export default SideNavbar;

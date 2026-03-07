import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PostsProvider } from './context/PostsContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BlogDetail from './pages/BlogDetail';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';
import About from './pages/About';
import Report from './pages/Report';
import './assets/css/main.css';
import UserProfile from './pages/Userprofile';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <PostsProvider>
            <ToastProvider>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/create-post" element={<CreatePost />} />
                <Route path="/profile" element={<Profile />} />
                <Route path='/user/:authorName' element={<UserProfile />} />
                <Route path="/about" element={<About />} />
                <Route path="/report" element={<Report />} />
              </Routes>
            </ToastProvider>
          </PostsProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const queryClient = new QueryClient();
const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : () => <div>Main Page Not Found</div>;

const LayoutWrapper = ({ children }) => Layout ? <Layout>{children}</Layout> : <>{children}</>;

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<LayoutWrapper><MainPage /></LayoutWrapper>} />
          {Object.entries(Pages).map(([path, Page]) => (
            <Route
              key={path}
              path={`/${path.toLowerCase().replace(/ /g, '-')}`}
              element={
                <LayoutWrapper>
                  <Page />
                </LayoutWrapper>
              }
            />
          ))}
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  )
}

export default App
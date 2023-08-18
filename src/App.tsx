import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import LogIn from "./pages/LogIn"
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom"
import SearchBread from "./pages/SearchBread"
import { Box } from "@mui/material"
import MatchDog from "./pages/MatchDog"
const queryClient = new QueryClient()

const App = () => {
  return (
    <Box width="100%" height="100%">
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<LogIn />} />
            <Route path="/search" element={<SearchBread />} />
            <Route path="/matchDog/:dogId" element={<MatchDog />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </Box>
  )
}

export default App
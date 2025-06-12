<script>
  import { page } from '$app/stores';
  
  function isActive(path) {
    return $page.url.pathname === path;
  }
</script>

<nav class="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
  <div class="container mx-auto px-4">
    <div class="flex items-center justify-between h-16">
      <div class="flex items-center">
        <a href="/" class="flex items-center text-white hover:text-blue-100 transition-colors">
          <span class="text-2xl mr-2">🌤️</span>
          <span class="text-xl font-semibold tracking-wide">Wetterinator</span>
        </a>
      </div>
      
      <div class="flex space-x-4">
        <a 
          href="/" 
          class="px-4 py-2 rounded-md text-white transition-all duration-200 {isActive('/') ? 'bg-white bg-opacity-20' : 'hover:bg-white hover:bg-opacity-10'}"
        >
          Home
        </a>
        <a 
          href="/favorites" 
          class="px-4 py-2 rounded-md text-white transition-all duration-200 {isActive('/favorites') ? 'bg-white bg-opacity-20' : 'hover:bg-white hover:bg-opacity-10'}"
        >
          Favoriten
        </a>
      </div>
    </div>
  </div>
</nav>

<style>
  /* Smooth transitions */
  a {
    position: relative;
    overflow: hidden;
  }

  /* Subtle hover effect */
  a::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background: white;
    transition: all 0.3s ease;
    transform: translateX(-50%);
  }

  a:hover::after {
    width: 80%;
  }
</style> 
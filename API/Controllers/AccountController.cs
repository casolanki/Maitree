
namespace API.Controllers
{

    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;

        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, DataContext context,
            ITokenService tokenService, IMapper maper)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _tokenService = tokenService;
            _mapper = maper;
        }

        [HttpPost("login")]

        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.Users
                    .Include(p => p.Photos)
                    .SingleOrDefaultAsync(x => x.UserName == loginDto.Username.ToLower());

            if (user == null) return Unauthorized("Invalid username");

            var result = await _signInManager
                            .CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (!result.Succeeded) return Unauthorized();

            return new UserDto
            {
                Username = user.UserName,
                Token = await _tokenService.CreateToken(user),
                PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                KnownAs = user.KnownAs,
                Gender = user.Gender,
            };
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await UserExists(registerDto.Username))
                return BadRequest("username is taken..!!");

            var user = _mapper.Map<AppUser>(registerDto);
            user.UserName = registerDto.Username.ToLower();

            var result = await _userManager.CreateAsync(user, registerDto.Password);
                      
             
            if (result.Succeeded)
            {
                var roleResult = await _userManager.AddToRoleAsync(user, "Member");

                if (!roleResult.Succeeded) return BadRequest(result.Errors);

                return new UserDto
                {
                    Username = user.UserName,
                    Token = await _tokenService.CreateToken(user),
                    PhotoUrl = user.Photos?.FirstOrDefault(x => x.IsMain)?.Url,
                    KnownAs = user.KnownAs,
                    Gender = user.Gender,
                };
            }

           return BadRequest(result.Errors); 

            // return new UserDto
            // {
            //     Username = user.UserName,
            //     Token = await _tokenService.CreateToken(user),
            //     PhotoUrl = user.Photos?.FirstOrDefault(x => x.IsMain)?.Url,
            //     KnownAs = user.KnownAs,
            //     Gender = user.Gender,
            // };
        }

        private async Task<bool> UserExists(string Username)
        {

            return await _userManager.Users.AnyAsync(x => x.UserName == Username.ToLower());

        }
    }
}

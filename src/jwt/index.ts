import { injectable } from "inversify";
import jsonwebtoken from "jsonwebtoken";
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
@injectable()
export class JWT {
    private secret = "xiaoman$%^&*()asdsd";
    private jwtOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: this.secret,
    };
    constructor() {
        this.strategy();
    }

    /**
     * 初始化jwt
     */
    public strategy() {
        const strategy = new Strategy(this.jwtOptions, (payload, done) => {
            done(null, payload);
        });
        passport.use(strategy);
    }

    /**
     *
     * @returns 中间件
     */
    public middleware() {
        return passport.authenticate("jwt", { session: false });
    }

    /**
     * 创建token
     * @param data Object
     */
    public createToken(data: object) {
        //有效期为7天
        return jsonwebtoken.sign(data, this.secret, { expiresIn: "7d" });
    }

    /**
     *
     * @returns 集成到express
     */
    public init() {
        return passport.initialize();
    }
}

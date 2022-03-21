## Configuring HTMLHint

In **[Megabyte Labs](https://megabyte.space)** projects, we store our HTMLHint configuration in `.config/htmlhint.cjs`. To accomodate this custom configuration location, we included the ability to specify the location of the configuration in the `.codeclimate.yml` file. Here is an example of customizing the location of the HTMLHint configuration:

### Sample CodeClimate Configuration

```yaml
---
engines:
  htmlhint:
    enabled: true
    configFile: .config/htmlhint.cjs
```
